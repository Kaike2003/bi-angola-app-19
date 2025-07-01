"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, Menu, X, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

interface AppHeaderProps {
  showSearch?: boolean
  title?: string
  subtitle?: string
  compact?: boolean
}

export function AppHeader({ showSearch = false, title, subtitle, compact = false }: AppHeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileMenuOpen(false)
  }

  const navigation = [
    { name: "Início", href: "/", show: true },
    { name: "Agendar", href: "/agendar", show: !!user },
    { name: "Meus Agendamentos", href: "/agendamentos", show: !!user },
    { name: "Admin", href: "/admin", show: user?.role === "ADMIN" },
  ].filter((item) => item.show)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className={`bg-white border-b shadow-sm sticky top-0 z-40 ${compact ? "py-2" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${compact ? "h-12" : "h-16"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className={`bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center ${compact ? "w-8 h-8" : "w-10 h-10"}`}
            >
              <Calendar className={`text-white ${compact ? "w-4 h-4" : "w-6 h-6"}`} />
            </div>
            <div>
              <h1 className={`font-bold text-gray-900 ${compact ? "text-base" : "text-lg"}`}>{title || "BI Angola"}</h1>
              {!compact && <p className="text-sm text-gray-600 hidden sm:block">{subtitle || "Agendamento Digital"}</p>}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-2 ${compact ? "h-8 px-2" : "h-10 px-3"}`}>
                    <div
                      className={`bg-red-100 rounded-full flex items-center justify-center ${compact ? "w-6 h-6" : "w-8 h-8"}`}
                    >
                      <span className={`font-medium text-red-600 ${compact ? "text-xs" : "text-sm"}`}>
                        {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {!compact && (
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                          {user.fullName || "Usuário"}
                        </p>
                        {user.role === "ADMIN" && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            Admin
                          </Badge>
                        )}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName || "Usuário"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/agendamentos" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Meus Agendamentos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Painel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size={compact ? "sm" : "default"}>
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size={compact ? "sm" : "default"} className="bg-red-600 hover:bg-red-700">
                    Registar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
