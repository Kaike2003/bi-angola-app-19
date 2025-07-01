"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AdminUser {
  id: string
  email: string
  fullName: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  createUser: (userData: {
    email: string
    password: string
    fullName: string
    phone?: string
    role?: string
  }) => Promise<void>
  refreshUser: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/admin/me", {
        credentials: "include",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Admin auth check error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro no login administrativo")
    }

    const data = await response.json()
    setUser(data.user)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/admin/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Admin logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const createUser = async (userData: {
    email: string
    password: string
    fullName: string
    phone?: string
    role?: string
  }) => {
    const response = await fetch("/api/auth/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao criar usuário")
    }

    return response.json()
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, createUser, refreshUser }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
