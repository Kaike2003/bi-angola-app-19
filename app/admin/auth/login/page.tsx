"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminAuth } from "@/contexts/admin-auth-context";

// 🔒 Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("Email inválido").endsWith("@bi.gov.ao", "O email deve terminar com @bi.gov.ao"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const router = useRouter();

  // 🔄 Validação em tempo real por campo
  const validateField = (field: "email" | "password", value: string) => {
    try {
      // Define o schema de campo dinamicamente com base no nome do campo
      const fieldSchema = field === "email" ? loginSchema.pick({ email: true }) : loginSchema.pick({ password: true });

      fieldSchema.parse({ [field]: value });

      if (field === "email") setEmailError("");
      if (field === "password") setPasswordError("");
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || "Campo inválido";
      if (field === "email") setEmailError(message);
      if (field === "password") setPasswordError(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const issues = result.error.format();
      setEmailError(issues.email?._errors[0] || "");
      setPasswordError(issues.password?._errors[0] || "");
      setFormError("Corrija os erros para continuar");
      setLoading(false);
      return;
    }

    const response = await login(email, password);
    if (response.user) {
      router.push("/admin");
    } else {
      setFormError(response.error || "Erro ao fazer login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-gray-900">Acesso Administrativo</CardTitle>
            <CardDescription>Entre com suas credenciais de administrador</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {formError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{formError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email do Administrador</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@bi.gov.ao"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField("email", e.target.value);
                    }}
                    onBlur={(e) => validateField("email", e.target.value)}
                    className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                  />
                </div>
                {emailError && <p className="text-sm text-red-600">{emailError}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha de administrador"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateField("password", e.target.value);
                    }}
                    onBlur={(e) => validateField("password", e.target.value)}
                    className={`pl-10 pr-10 ${passwordError ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Entrar como Admin"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Acesso público?{" "}
                <Link href="/auth/login" className="text-red-600 hover:underline font-medium">
                  Login de Usuário
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">Área Restrita</p>
              </div>
              <p className="text-xs text-amber-700">
                Esta área é exclusiva para administradores do sistema BI Angola. Apenas usuários com permissões
                administrativas podem acessar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
