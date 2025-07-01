import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BI Angola - Sistema de Agendamento",
  description: "Sistema oficial de agendamento para emissão do Bilhete de Identidade em Angola",
  keywords: ["BI", "Angola", "Bilhete de Identidade", "Agendamento", "Governo"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <AdminAuthProvider>
              {children}
              <Toaster />
            </AdminAuthProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
