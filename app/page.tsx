"use client"

import Link from "next/link"
import { Calendar, MapPin, User, ArrowRight, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import { Loading } from "@/components/loading"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading message="Carregando..." />
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Globe className="w-4 h-4 mr-2" />
              Plataforma Oficial do Governo de Angola
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Agende o seu
              <br />
              <span className="text-yellow-300 relative">
                Bilhete de Identidade
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-300/50 rounded"></div>
              </span>
              <br />
              de forma digital
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto leading-relaxed">
              Sistema oficial para marcação de agendamentos dos serviços do Bilhete de Identidade. Rápido, seguro e
              disponível 24 horas por dia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link href="/agendar">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Começar Agora
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg"
                    >
                      Já tenho conta
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o agendamento digital?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma experiência moderna e eficiente para todos os cidadãos angolanos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Disponível 24/7</h3>
                <p className="text-gray-600">Marque o seu horário a qualquer hora, qualquer dia da semana</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Processo Rápido</h3>
                <p className="text-gray-600">Agendamento em menos de 3 minutos com confirmação instantânea</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Seguro e Oficial</h3>
                <p className="text-gray-600">Plataforma oficial do governo com máxima segurança de dados</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Em Todo o País</h3>
                <p className="text-gray-600">Postos de atendimento em todas as províncias de Angola</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Serviços Disponíveis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todos os serviços do Bilhete de Identidade num só lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Primeira Emissão",
                description: "Para cidadãos que necessitam do primeiro Bilhete de Identidade",
                duration: "30-45 min",
                cost: "8.500 AKZ",
                popular: true,
              },
              {
                title: "Renovação",
                description: "Renovação do Bilhete de Identidade expirado ou por expirar",
                duration: "20-30 min",
                cost: "6.500 AKZ",
                popular: false,
              },
              {
                title: "Actualização de Dados",
                description: "Alteração de dados pessoais no Bilhete de Identidade",
                duration: "25-35 min",
                cost: "7.000 AKZ",
                popular: false,
              },
              {
                title: "Segunda Via",
                description: "Emissão de segunda via por perda, roubo ou danos",
                duration: "30-40 min",
                cost: "8.500 AKZ",
                popular: false,
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-xl transition-all ${service.popular ? "ring-2 ring-red-500" : ""}`}
              >
                {service.popular && (
                  <Badge className="absolute -top-2 left-4 bg-red-600 text-white">Mais Procurado</Badge>
                )}
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex justify-between">
                      <span>Duração:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo:</span>
                      <span className="font-medium text-red-600">{service.cost}</span>
                    </div>
                  </div>
                  {user ? (
                    <Link href="/agendar">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Agendar Serviço</Button>
                    </Link>
                  ) : (
                    <Link href="/auth/register">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Registar para Agendar</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Test Accounts Section */}
      {!user && (
        <section className="py-20 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contas de Demonstração</h2>
            <p className="text-gray-600 mb-8">Experimente o sistema com estas contas de teste</p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Conta de Administrador</h3>
                  <p className="text-gray-600 text-sm mb-4">Acesso completo ao painel administrativo</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> admin@bi.gov.ao
                    </p>
                    <p>
                      <strong>Senha:</strong> admin123
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Conta de Usuário</h3>
                  <p className="text-gray-600 text-sm mb-4">Acesso para criar e gerenciar agendamentos</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> user@example.com
                    </p>
                    <p>
                      <strong>Senha:</strong> user123
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de angolanos que já usam o agendamento digital
          </p>
          {user ? (
            <Link href="/agendar">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Fazer Meu Agendamento
              </Button>
            </Link>
          ) : (
            <Link href="/auth/register">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Criar Conta Gratuita
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
