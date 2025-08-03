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
      console.log("Dados recebidos da API:", data);

      const workbook = XLSX.utils.book_new();

      const flatten = (obj: any, prefix = ""): any =>
        Object.entries(obj).reduce((acc, [key, val]) => {
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            Object.assign(acc, flatten(val, newKey)); // recursivo para aninhados
          } else {
            acc[newKey] = val;
          }
          return acc;
        }, {} as any);

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          const flattened = value.map((item) => flatten(item));
          const worksheet = XLSX.utils.json_to_sheet(flattened);
          XLSX.utils.book_append_sheet(workbook, worksheet, key); // uma aba por chave
        }
      });

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bi-angola-backup-${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Todos os dados foram exportados com sucesso para Excel!");
    } catch (err) {
      console.error("Erro ao exportar:", err);
      setMessage("Erro ao exportar dados para Excel.");
    }
    setLoading(false);
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
                <Button onClick={handleExportExcel} variant="outline" disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
