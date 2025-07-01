"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalData } from "@/hooks/use-local-data"
import { localData } from "@/lib/local-storage"

export function AdminDebug() {
  const [showDebug, setShowDebug] = useState(false)
  const { getUsers, getPostos, getServices, getAppointments } = useLocalData()

  const handleDebug = () => {
    localData.debugData()
    setShowDebug(!showDebug)
  }

  const handleResetData = () => {
    if (confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.")) {
      localData.resetData()
      window.location.reload()
    }
  }

  if (!showDebug) {
    return (
      <div className="text-right">
        <Button onClick={handleDebug} variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-gray-600">
          🔧 Debug
        </Button>
      </div>
    )
  }

  const users = getUsers()
  const postos = getPostos()
  const services = getServices()
  const appointments = getAppointments()

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Debug do Sistema
          <div className="space-x-2">
            <Button onClick={handleDebug} variant="outline" size="sm">
              Fechar
            </Button>
            <Button onClick={handleResetData} variant="destructive" size="sm">
              Reset Dados
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Usuários:</strong> {users.length}
            <ul className="mt-1 text-xs">
              {users.map((user) => (
                <li key={user.id}>
                  {user.email} ({user.role})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Postos:</strong> {postos.length}
            <ul className="mt-1 text-xs">
              {postos.map((posto) => (
                <li key={posto.id}>{posto.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Serviços:</strong> {services.length}
            <ul className="mt-1 text-xs">
              {services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Agendamentos:</strong> {appointments.length}
            <ul className="mt-1 text-xs">
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  {appointment.referenceNumber} - {appointment.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
