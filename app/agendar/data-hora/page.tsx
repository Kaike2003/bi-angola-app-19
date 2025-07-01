"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { useLocalData } from "@/hooks/use-local-data"

const steps = [
  { id: 1, title: "Escolher Serviço", active: true },
  { id: 2, title: "Seleccionar Posto", active: true },
  { id: 3, title: "Data e Hora", active: true },
  { id: 4, title: "Confirmação", active: false },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
]

export default function DataHoraPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const postoId = searchParams.get("posto")

  const { getServiceById, getPostoById, getAppointments } = useLocalData()
  const [selectedService, setSelectedService] = useState<ReturnType<typeof getServiceById>>(null)
  const [selectedPosto, setSelectedPosto] = useState<ReturnType<typeof getPostoById>>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<ReturnType<typeof getAppointments>>([])

  useEffect(() => {
    if (serviceId) {
      setSelectedService(getServiceById(serviceId))
    }
    if (postoId) {
      setSelectedPosto(getPostoById(postoId))
    }
    setAppointments(getAppointments())
  }, [serviceId, postoId])

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const isDateAvailable = (day: number | null) => {
    if (!day) return false

    const today = new Date()
    const selectedDateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    // Não permitir datas passadas
    if (selectedDateObj < today) return false

    // Não permitir fins de semana (opcional)
    const dayOfWeek = selectedDateObj.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) return false

    return true
  }

  const isTimeAvailable = (time: string) => {
    if (!selectedDate || !postoId) return true

    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`

    // Verificar se já existe agendamento para este horário
    const existingAppointment = appointments.find(
      (apt) =>
        apt.postoId === postoId &&
        apt.appointmentDate === dateStr &&
        apt.appointmentTime === time &&
        apt.status === "SCHEDULED",
    )

    return !existingAppointment
  }

  const handleDateSelect = (day: number | null) => {
    if (!day || !isDateAvailable(day)) return

    const dateStr = String(day).padStart(2, "0")
    setSelectedDate(dateStr)
    setSelectedTime(null) // Reset time when date changes
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const getMonthName = () => {
    return currentMonth.toLocaleDateString("pt-PT", { month: "long", year: "numeric" })
  }

  const nextUrl =
    selectedDate && selectedTime
      ? `/agendar/confirmacao?service=${serviceId}&posto=${postoId}&date=${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${selectedDate}&time=${selectedTime}`
      : "#"

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Data e Hora</h1>
          <p className="text-gray-600">Seleccione data e hora</p>
          {selectedService && selectedPosto && (
            <div className="text-sm text-gray-500 mt-2">
              <p>
                <span className="font-medium text-red-600">{selectedService.name}</span> em{" "}
                <span className="font-medium">{selectedPosto.name}</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Escolher Data</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">{getMonthName()}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    disabled={!isDateAvailable(day)}
                    className={`p-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                      selectedDate === String(day).padStart(2, "0")
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : isDateAvailable(day)
                          ? "text-gray-900 hover:bg-gray-100"
                          : "text-gray-400 cursor-not-allowed"
                    } ${!day ? "invisible" : ""}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>• Fins de semana não disponíveis</p>
                <p>• Selecione uma data para ver horários</p>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Escolher Hora</CardTitle>
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  Data selecionada: {selectedDate}/{String(currentMonth.getMonth() + 1).padStart(2, "0")}/
                  {currentMonth.getFullYear()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Selecione uma data primeiro</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={!isTimeAvailable(time)}
                        className={`p-2 text-sm rounded border transition-colors ${
                          selectedTime === time
                            ? "bg-red-600 text-white border-red-600"
                            : isTimeAvailable(time)
                              ? "border-gray-300 hover:border-red-600 hover:text-red-600"
                              : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>• Horários em cinza já estão ocupados</p>
                    <p>• Duração: {selectedService?.duration || "30-45 min"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href={`/agendar/posto?service=${serviceId}`}>
            <Button variant="outline" className="bg-white text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Link href={nextUrl}>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8" disabled={!selectedDate || !selectedTime}>
              Continuar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
