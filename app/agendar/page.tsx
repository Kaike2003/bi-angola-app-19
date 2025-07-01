"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, ArrowLeft, FileText, RotateCcw, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { AppHeader } from "@/components/app-header"

const steps = [
  { id: 1, title: "Escolher Serviço", active: true },
  { id: 2, title: "Seleccionar Posto", active: false },
  { id: 3, title: "Data e Hora", active: false },
  { id: 4, title: "Confirmação", active: false },
]

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  requirements?: string[]
}

export default function AgendarPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
        console.log(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case "Primeira Emissão":
        return FileText
      case "Renovação":
        return RotateCcw
      case "Segunda Via":
        return Clock
      case "Actualização de Dados":
        return UserCheck
      default:
        return FileText
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando serviços...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <AppHeader compact />

        {/* Progress Steps */}
        <div className="bg-white border-b py-4">
          <div className="max-w-4xl mx-auto px-4">
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Escolher Serviço</h1>
            <p className="text-gray-600">Seleccione o tipo de serviço</p>
            <p className="text-gray-500 text-sm">Escolha o serviço que pretende solicitar</p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço disponível</h3>
              <p className="text-gray-600">Não há serviços disponíveis no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {services.map((service) => {
                const IconComponent = getServiceIcon(service.name)
                return (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedService === service.id ? "ring-2 ring-red-600 bg-red-50" : ""
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                          <div className="space-y-1 text-sm text-gray-500">
                            <p>
                              <strong>Duração:</strong> {service.duration}
                            </p>
                            <p>
                              <strong>Custo:</strong> {service.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="flex justify-between">
            <Link href="/">
              <Button variant="outline" className="bg-white text-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link href={selectedService ? `/agendar/posto?service=${selectedService}` : "#"}>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8" disabled={!selectedService}>
                Continuar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
