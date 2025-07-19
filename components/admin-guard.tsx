"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { useAdminAuth } from "@/contexts/admin-auth-context";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (user.role !== "ADMIN") {
        router.push("/");
        return;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Verificando permissões..." />;
  }

  if (!user || user.role !== "ADMIN") {
    return <Loading message="Redirecionando..." />;
  }

  return <>{children}</>;
}
