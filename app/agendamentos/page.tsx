"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Phone, Search, Filter, Eye, Download, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { useLocalData } from "@/hooks/use-local-data";
import { generateAppointmentPDF } from "@/lib/pdf-generator";
import Link from "next/link";
import { Appointment } from "../admin/appointments/page";

export default function AgendamentosPage() {
  const { user } = useAuth();
  const { getAppointmentsWithDetails } = useLocalData();
  const [appointments, setAppointments] = useState<ReturnType<typeof getAppointmentsWithDetails>>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<ReturnType<typeof getAppointmentsWithDetails>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<
    ReturnType<typeof getAppointmentsWithDetails>[0] | null
  >(null);

  useEffect(() => {
    if (user) {
      fetchAppointmentsFromAPI();
    }
  }, [user]);

  const fetchAppointmentsFromAPI = async () => {
    try {
      const response = await fetch("/api/appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // importante se usa cookies/session
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar agendamentos");
      }

      const data = await response.json();

      // Se quiser filtrar só os do usuário logado:
      const userAppointments = data.filter((a: any) => a.userId === user?.id);

      setAppointments(userAppointments);
      setFilteredAppointments(userAppointments);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    let filtered = appointments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.posto?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const handleUpdateStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)));
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4" />;
      case "COMPLETED":
        return <Calendar className="w-4 h-4" />;
      case "CANCELLED":
        return <RefreshCw className="w-4 h-4" />;
      case "NO_SHOW":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleDownloadPDF = (appointment: any) => {
    if (!user) return;

    const pdfData = {
      referenceNumber: appointment.referenceNumber,
      userName: user.fullName || user.email,
      userEmail: user.email,
      serviceName: appointment.service?.name || "N/A",
      serviceDescription: appointment.service?.description,
      serviceCost: appointment.service?.cost || "N/A",
      serviceDuration: appointment.service?.duration || "N/A",
      postoName: appointment.posto?.name || "N/A",
      postoAddress: appointment.posto?.address || "N/A",
      postoPhone: appointment.posto?.phone,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      createdAt: appointment.createdAt,
    };

    generateAppointmentPDF(pdfData);
  };

  const handleDownloadJSON = (appointment: any) => {
    const receiptData = {
      referenceNumber: appointment.referenceNumber,
      service: appointment.service?.name,
      posto: appointment.posto?.name,
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      status: getStatusText(appointment.status),
      user: user?.fullName,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agendamento-${appointment.referenceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AppHeader showSearch title="BI Angola" subtitle="Meus Agendamentos" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie e acompanhe todos os seus agendamentos do Bilhete de Identidade
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agendados</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {appointments.filter((a) => a.status === "SCHEDULED").length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {appointments.filter((a) => a.status === "COMPLETED").length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cancelados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {appointments.filter((a) => a.status === "CANCELLED").length}
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por número, serviço ou posto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="SCHEDULED">Agendados</SelectItem>
                    <SelectItem value="COMPLETED">Concluídos</SelectItem>
                    <SelectItem value="CANCELLED">Cancelados</SelectItem>
                    <SelectItem value="NO_SHOW">Faltou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {appointments.length === 0 ? "Nenhum agendamento encontrado" : "Nenhum resultado"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {appointments.length === 0
                      ? "Você ainda não possui agendamentos. Que tal criar o seu primeiro?"
                      : "Tente ajustar os filtros para encontrar o que procura."}
                  </p>
                  {appointments.length === 0 && (
                    <Link href={"/agendar"}>
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Fazer Agendamento
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{getStatusText(appointment.status)}</span>
                          </Badge>
                          <span className="text-sm font-mono text-gray-600">#{appointment.referenceNumber}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{appointment.service?.name}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.posto?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(appointment.appointmentDate).toLocaleDateString("pt-PT")} às{" "}
                              {appointment.appointmentTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.posto?.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Duração: {appointment.service?.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Agendamento</DialogTitle>
                              <DialogDescription>Informações completas do seu agendamento</DialogDescription>
                            </DialogHeader>
                            {selectedAppointment && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <Badge className={getStatusColor(selectedAppointment.status)}>
                                    {getStatusIcon(selectedAppointment.status)}
                                    <span className="ml-1">{getStatusText(selectedAppointment.status)}</span>
                                  </Badge>
                                  <span className="text-lg font-mono">#{selectedAppointment.referenceNumber}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Informações do Serviço</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Serviço:</strong> {selectedAppointment.service?.name}
                                      </p>
                                      <p>
                                        <strong>Descrição:</strong> {selectedAppointment.service?.description}
                                      </p>
                                      <p>
                                        <strong>Duração:</strong> {selectedAppointment.service?.duration}
                                      </p>
                                      <p>
                                        <strong>Custo:</strong> {selectedAppointment.service?.cost}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">Local e Horário</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Posto:</strong> {selectedAppointment.posto?.name}
                                      </p>
                                      <p>
                                        <strong>Endereço:</strong> {selectedAppointment.posto?.address}
                                      </p>
                                      <p>
                                        <strong>Telefone:</strong> {selectedAppointment.posto?.phone}
                                      </p>
                                      <p>
                                        <strong>Data:</strong>{" "}
                                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString("pt-PT")}
                                      </p>
                                      <p>
                                        <strong>Hora:</strong> {selectedAppointment.appointmentTime}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    onClick={() => handleDownloadPDF(selectedAppointment)}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Baixar PDF
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(appointment)}>
                          <FileText className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={appointment.status === "CANCELLED"}
                          onClick={() => handleUpdateStatus(appointment.id, "CANCELLED")}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
