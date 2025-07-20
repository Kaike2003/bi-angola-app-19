"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { useEmployeeAuth } from "@/contexts/employee-auth-context";

interface EmployeeGuardProps {
  children: React.ReactNode;
}

export function EmployeeGuard({ children }: EmployeeGuardProps) {
  const { user, loading } = useEmployeeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (user.role !== "EMPLOYEE") {
        router.push("/");
        return;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Verificando permissões..." />;
  }

  if (!user || user.role !== "EMPLOYEE") {
    return <Loading message="Redirecionando..." />;
  }

  return <>{children}</>;
}
