"use client";

import { useEffect, useState } from "react";
import { BarChart3, Calendar, Users, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/stats?page=${page}&limit=${limit}`, { credentials: "include" });
        if (!res.ok) throw new Error("Erro ao buscar estatísticas");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [page]);

  const getAppointmentCountByStatus = (status: string) =>
    data?.appointmentStats.find((s: any) => s.status === status)?._count?.status || 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
            <p>Carregando relatórios...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-600 text-center py-10">Erro: {error}</div>
      </AdminLayout>
    );
  }

  const totalPages = Math.ceil(data?.pagination?.total / limit);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Estatísticas</h1>
          <p className="text-gray-600">Visão geral do desempenho do sistema</p>
        </div>

        {/* Totais Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total de Usuários" icon={Users} value={data?.totals?.users} />
          <StatCard title="Total de Agendamentos" icon={Calendar} value={data?.totals?.appointments} />
          <StatCard title="Concluídos" icon={CheckCircle} value={getAppointmentCountByStatus("COMPLETED")} />
          <StatCard title="Agendados" icon={Clock} value={getAppointmentCountByStatus("SCHEDULED")} />
        </div>

        {/* Agendamentos Recentes + Paginação */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Agendamentos</CardTitle>
            <CardDescription>Listagem paginada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {data?.recentAppointments?.map((apt: any) => (
                <div
                  key={apt.id}
                  className="border rounded-md p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">{apt.user.fullName}</div>
                    <div className="text-gray-500">{apt.user.email}</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{apt.service.name}</span> em{" "}
                    <span className="text-gray-700">{apt.posto.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(apt.createdAt).toLocaleString("pt-PT")}</div>
                </div>
              ))}
            </div>

            {/* Controles de Paginação */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, icon: Icon, value }: { title: string; icon: React.ElementType; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
