"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface EmployeeUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeAuthContextType {
  user: EmployeeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  createUser: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }) => Promise<RegisterResult>;
  refreshUser: () => Promise<void>;
}

interface RegisterResult {
  user?: Partial<EmployeeUser>;
  error?: string;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EmployeeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/employee/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Admin auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<RegisterResult> => {
    const response = await fetch("/api/auth/employee/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro no login administrativo");
    }

    const data = await response.json();
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/employee/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("email");
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }): Promise<RegisterResult> => {
    const response = await fetch("/api/auth/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar usuário");
    }

    return response.json();
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <EmployeeAuthContext.Provider value={{ user, loading, login, logout, createUser, refreshUser }}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (context === undefined) {
    throw new Error("useEmployeeAuth must be used within an EmployeeAuthProvider");
  }
  return context;
}
