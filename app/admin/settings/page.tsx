"use client";

import { useState } from "react";
import { Settings, Database, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminLayout from "@/components/admin-layout";
import * as XLSX from "xlsx";

export default function SettingsPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const flatten = (obj: any, prefix = ""): any =>
    Object.entries(obj).reduce((acc, [key, val]) => {
      const newKey = prefix ? `${prefix}_${key}` : key;
      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        Object.assign(acc, flatten(val, newKey));
      } else {
        acc[newKey] = val;
      }
      return acc;
    }, {} as any);

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      console.log(data);

      const workbook = XLSX.utils.book_new();

      Object.entries(data).forEach(([key, value]) => {
        // Aplica flatten a cada item da lista
        const flattened = (value as any[]).map((item) => flatten(item));
        const worksheet = XLSX.utils.json_to_sheet(flattened);
        XLSX.utils.book_append_sheet(workbook, worksheet, key);
      });

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bi-angola-backup-${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Dados exportados para Excel com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao exportar dados para Excel.");
    }
    setLoading(false);
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bi-angola-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Dados exportados com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao exportar dados.");
    }
    setLoading(false);
  };

  const handleResetData = async () => {
    if (confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.")) {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/reset", { method: "POST" });
        const data = await res.json();

        if (res.ok) {
          setMessage(data.message || "Dados resetados com sucesso!");
        } else {
          setMessage(data.error || "Erro ao resetar dados.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Erro ao resetar dados.");
      }
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerir configurações e dados do sistema</p>
        </div>

        {message && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Gestão de Dados
            </CardTitle>
            <CardDescription>Gerir dados do banco de dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Exportar Dados</h3>
                <p className="text-sm text-gray-600">Fazer backup de todos os dados do sistema</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportData} variant="outline" disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button onClick={handleExportExcel} variant="outline" disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Reset dos Dados</h3>
                <p className="text-sm text-gray-600">Restaurar dados originais do sistema</p>
              </div>
              <Button
                onClick={handleResetData}
                variant="outline"
                className="text-red-600 border-red-200"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Informações do Sistema
            </CardTitle>
            <CardDescription>Detalhes técnicos da aplicação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Versão:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Dados:</span>
                <span className="font-medium">Banco de Dados</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última Atualização:</span>
                <span className="font-medium">{new Date().toLocaleDateString("pt-PT")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
