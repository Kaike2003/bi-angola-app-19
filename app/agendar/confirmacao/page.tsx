"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Download, CalendarPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/contexts/auth-context";
import { generateAppointmentPDF } from "@/lib/pdf-generator";

const steps = [
  { id: 1, title: "Escolher Serviço", active: true },
  { id: 2, title: "Seleccionar Posto", active: true },
  { id: 3, title: "Data e Hora", active: true },
  { id: 4, title: "Confirmação", active: true },
];

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  requirements?: string[];
}

interface Posto {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

interface Appointment {
  id: string;
  referenceNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
  service: Service;
  posto: Posto;
}

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const serviceId = searchParams.get("service");
  const postoId = searchParams.get("posto");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedRef = useRef(false);

  useEffect(() => {
    if (!user || !serviceId || !postoId || !date || !time) {
      router.push(!user ? "/auth/login" : "/agendar");
      return;
    }

    if (!hasCreatedRef.current) {
      hasCreatedRef.current = true;
      createAppointment();
    }
  }, [user, serviceId, postoId, date, time]);
  const createAppointment = async () => {
    console.log("executado");
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          serviceId,
          postoId,
          appointmentDate: date,
          appointmentTime: time,
          notes: `Agendamento criado via sistema web`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar agendamento");
      }

      const newAppointment = await response.json();
      setAppointment(newAppointment);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!appointment || !user) return;

    const pdfData = {
      referenceNumber: appointment.referenceNumber,
      userName: user.fullName || user.email,
      userEmail: user.email,
      serviceName: appointment.service.name,
      serviceDescription: appointment.service.description,
      serviceCost: appointment.service.price,
      serviceDuration: appointment.service.duration,
      postoName: appointment.posto.name,
      postoAddress: appointment.posto.address,
      postoPhone: appointment.posto.phone,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      createdAt: appointment.createdAt,
    };

    generateAppointmentPDF(pdfData);
  };

  const handleDownloadJSON = () => {
    if (!appointment || !user) return;

    const data = {
      agendamento: {
        numero: appointment.referenceNumber,
        status: appointment.status,
        criadoEm: appointment.createdAt,
      },
      usuario: {
        nome: user.fullName || user.email,
        email: user.email,
      },
      servico: {
        nome: appointment.service.name,
        descricao: appointment.service.description,
        duracao: appointment.service.duration,
        custo: appointment.service.price,
      },
      posto: {
        nome: appointment.posto.name,
        endereco: appointment.posto.address,
        telefone: appointment.posto.phone,
        horario: appointment.posto.hours,
      },
      atendimento: {
        data: appointment.appointmentDate,
        hora: appointment.appointmentTime,
        dataFormatada: new Date(appointment.appointmentDate).toLocaleDateString("pt-PT", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agendamento-${appointment.referenceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addToCalendar = () => {
    if (!appointment) return;

    const startDate = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora depois

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Agendamento BI - ${appointment.service.name}`
    )}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(
      `Número: ${appointment.referenceNumber}
Serviço: ${appointment.service.name}
Posto: ${appointment.posto.name}
Endereço: ${appointment.posto.address}`
    )}&location=${encodeURIComponent(appointment.posto.address)}`;

    window.open(calendarUrl, "_blank");
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Criando seu agendamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Erro ao criar agendamento</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/agendar">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Tentar Novamente</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader compact />

      {/* Progress Steps */}
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step.active ? "bg-red-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Agendamento Confirmado!</h1>
          <p className="text-gray-600">
            O seu agendamento foi criado com sucesso. Receberá um email de confirmação em breve.
          </p>
        </div>

        {/* Appointment Details */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Número de Agendamento</h2>
            <p className="text-sm text-gray-600 mb-2">Guarde este número para consultas futuras</p>
            <div className="text-3xl font-bold text-red-600 mb-6">{appointment.referenceNumber}</div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Button onClick={handleDownloadPDF} className="bg-red-600 hover:bg-red-700 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>

              <Button onClick={addToCalendar} variant="outline" className="bg-white text-gray-700 border-gray-300">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Adicionar ao Calendário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-center">
            <strong className="text-yellow-800">Lembrete Importante</strong>
            <br />
            <span className="text-yellow-700">
              Chegue 15 minutos antes da hora marcada e traga todos os documentos necessários. Em caso de
              impossibilidade, cancele ou reagende o seu atendimento.
            </span>
          </AlertDescription>
        </Alert>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Resumo do Agendamento</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium">{appointment.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{appointment.service.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo:</span>
                  <span className="font-medium">{appointment.service.price} Kz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-blue-600">Agendado</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posto:</span>
                  <span className="font-medium">{appointment.posto.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">
                    {new Date(appointment.appointmentDate).toLocaleDateString("pt-PT", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{appointment.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{appointment.posto.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {appointment.service.requirements && appointment.service.requirements.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Documentos Necessários</h3>
              <ul className="space-y-2">
                {appointment.service.requirements.map((requirement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Link href="/agendamentos">
            <Button variant="outline" className="bg-white text-gray-700 mr-4">
              Ver Meus Agendamentos
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
