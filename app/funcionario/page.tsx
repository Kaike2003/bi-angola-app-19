"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, MapPin, TrendingUp, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import EmployeeLayout from "@/components/employee-layout";

interface Stats {
  totals: {
    users: number;
    postos: number;
    services: number;
    appointments: number;
  };
  appointmentStats: Array<{ status: string; _count: { status: number } }>;
  userStats: Array<{ role: string; _count: { role: number } }>;
  postoStats: Array<{ status: string; _count: { status: number } }>;
  recentAppointments: Array<{
    id: string;
    referenceNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    user: { fullName: string; email: string };
    service: { name: string };
    posto: { name: string };
  }>;
}

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/employee/stats");
      if (response.ok) {
        const data = await response.json();
        console.log("DADOS DO STATS:", data); // 👈 veja se totals está presente
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Agendado";
      case "COMPLETED":
        return "Concluído";
      case "CANCELLED":
        return "Cancelado";
      case "NO_SHOW":
        return "Faltou";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  if (!stats) {
    return (
      <EmployeeLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Erro ao carregar estatísticas</p>
        </div>
      </EmployeeLayout>
    );
  }

  const completionRate =
    stats?.totals?.appointments > 0
      ? Math.round(
          ((stats.appointmentStats.find((s) => s.status === "COMPLETED")?._count.status || 0) /
            stats.totals.appointments) *
            100
        )
      : 0;

  return (
    <EmployeeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema BI Angola</p>
        </div>

        {/* Main Stats - Clicáveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totals.users}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.userStats.find((s) => s.role === "EMPLOYEE")?._count.role || 0} admins
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/funcionario/appointments")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
              <div className="flex items-center mt-2 text-xs text-green-600">
                <span>Ver agendamentos</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Postos Ativos</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totals.postos}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.postoStats.find((s) => s.status === "ACTIVE")?._count.status || 0} ativos
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-l-4 border-l-purple-500 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/funcionario/reports")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totals.appointments}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.appointmentStats.find((s) => s.status === "SCHEDULED")?._count.status || 0} pendentes
              </p>
              <div className="flex items-center mt-2 text-xs text-purple-600">
                <span>Ver relatórios</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Operações mais utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="h-16 flex-col gap-2"
                variant="outline"
                onClick={() => router.push("/funcionario/appointments")}
              >
                <Calendar className="w-5 h-5" />
                <span>Ver Agendamentos</span>
              </Button>
              <Button
                className="h-16 flex-col gap-2"
                variant="outline"
                onClick={() => router.push("/funcionario/reports")}
              >
                <Activity className="w-5 h-5" />
                <span>Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agendamentos Recentes</CardTitle>
                <CardDescription>Últimos agendamentos criados no sistema</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/funcionario/appointments")}>
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.referenceNumber}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.user.fullName} - {appointment.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.appointmentDate} às {appointment.appointmentTime}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Agendamentos</CardTitle>
              <CardDescription>Distribuição por status atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.appointmentStats.map((stat) => (
                  <div key={stat.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stat.status === "SCHEDULED"
                            ? "bg-blue-500"
                            : stat.status === "COMPLETED"
                            ? "bg-green-500"
                            : stat.status === "CANCELLED"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-sm">{getStatusText(stat.status)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat._count.status}</span>
                      <Progress value={(stat._count.status / stats.totals.appointments) * 100} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
}
