"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Clock, MapPin, Phone, ArrowLeft, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { AppHeader } from "@/components/app-header"

const steps = [
  { id: 1, title: "Escolher Serviço", active: true },
  { id: 2, title: "Seleccionar Posto", active: true },
  { id: 3, title: "Data e Hora", active: false },
  { id: 4, title: "Confirmação", active: false },
]

const ITEMS_PER_PAGE = 6

interface Posto {
  id: string
  name: string
  address: string
  municipality: string
  province: string
  phone?: string
  hours: string
  capacity: number
  manager?: string
  availability: string
}

interface Service {
  id: string
  name: string
  description: string
}

export default function PostoPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")

  const [postos, setPostos] = useState<Posto[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedPosto, setSelectedPosto] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [provinceFilter, setProvinceFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [serviceId])

  const fetchData = async () => {
    try {
      const [postosResponse, serviceResponse] = await Promise.all([
        fetch("/api/postos"),
        serviceId ? fetch(`/api/services?id=${serviceId}`) : Promise.resolve(null),
      ])

      if (postosResponse.ok) {
        const postosData = await postosResponse.json()
        setPostos(postosData)
      }

      if (serviceResponse && serviceResponse.ok) {
        const serviceData = await serviceResponse.json()
        setSelectedService(serviceData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar postos
  const filteredPostos = useMemo(() => {
    return postos.filter((posto) => {
      const matchesSearch =
        posto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        posto.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        posto.municipality.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProvince = provinceFilter === "all" || posto.province === provinceFilter
      const matchesAvailability = availabilityFilter === "all" || posto.availability === availabilityFilter

      return matchesSearch && matchesProvince && matchesAvailability
    })
  }, [postos, searchTerm, provinceFilter, availabilityFilter])

  // Paginação
  const totalPages = Math.ceil(filteredPostos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPostos = filteredPostos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, provinceFilter, availabilityFilter])

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Alto":
        return "bg-green-100 text-green-800 border-green-200"
      case "Médio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Baixo":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const nextUrl = selectedPosto ? `/agendar/data-hora?service=${serviceId}&posto=${selectedPosto}` : "#"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando postos...</p>
        </div>
      </div>
    )
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Seleccionar Posto</h1>
          <p className="text-gray-600">Escolha o posto de atendimento</p>
          {selectedService && (
            <p className="text-gray-500 text-sm">
              Para o serviço: <span className="font-medium text-red-600">{selectedService.name}</span>
            </p>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar posto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Província" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Províncias</SelectItem>
                  <SelectItem value="Luanda">Luanda</SelectItem>
                  <SelectItem value="Benguela">Benguela</SelectItem>
                  <SelectItem value="Huíla">Huíla</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alto">Alta</SelectItem>
                  <SelectItem value="Médio">Média</SelectItem>
                  <SelectItem value="Baixo">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                <span className="font-medium">{filteredPostos.length}</span>
                <span className="ml-1">postos encontrados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Postos Grid */}
        {paginatedPostos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum posto encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros para encontrar postos disponíveis.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setProvinceFilter("all")
                  setAvailabilityFilter("all")
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPostos.map((posto) => (
                <Card
                  key={posto.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPosto === posto.id ? "ring-2 ring-red-600 bg-red-50" : ""
                  }`}
                  onClick={() => setSelectedPosto(posto.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{posto.name}</h3>
                        <p className="text-sm text-gray-600">
                          {posto.municipality}, {posto.province}
                        </p>
                      </div>
                      <Badge className={getAvailabilityColor(posto.availability)}>{posto.availability}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{posto.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{posto.hours}</span>
                      </div>
                      {posto.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{posto.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Capacidade: {posto.capacity}/dia</span>
                      {posto.manager && <span className="truncate ml-2">{posto.manager}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/agendar">
            <Button variant="outline" className="bg-white text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Link href={nextUrl}>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8" disabled={!selectedPosto}>
              Continuar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
