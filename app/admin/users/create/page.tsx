"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import AdminLayout from "@/components/admin-layout";
import Link from "next/link";
import { z } from "zod";

// ✅ Schema de validação Zod
const schema = z.object({
  fullName: z.string().min(2, "Nome completo obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  phone: z.string().min(9, "Número de telefone inválido").max(20).optional().or(z.literal("")),
  role: z.enum(["USER", "ADMIN", "EMPLOYEE"]),
});

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "USER" as "USER" | "ADMIN" | "EMPLOYEE",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { createUser } = useAdminAuth();
  const router = useRouter();

  const validateField = (field: keyof typeof formData, value: string) => {
    const partial = schema.safeParse({ ...formData, [field]: value });
    if (!partial.success) {
      const issue = partial.error.issues.find((i) => i.path[0] === field);
      setFormErrors((prev) => ({ ...prev, [field]: issue?.message || "" }));
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value); // ✅ validação reativa
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setFormErrors(newErrors);
      setLoading(false);
      return;
    }

    const res = await createUser(formData);

    if (res) {
      setSuccess(`${formData.role === "ADMIN" ? "Administrador" : "Usuário"} criado com sucesso!`);
      setFormData({ email: "", password: "", fullName: "", phone: "", role: "USER" });
      setFormErrors({});
    } else {
      setError((res.error as any) || "Erro ao criar usuário");
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Criar Novo Usuário</h1>
            <p className="text-gray-600">Adicione um novo usuário ou administrador ao sistema</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>Preencha os dados para criar uma nova conta no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Nome completo do usuário"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10"
                    />
                    {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                    {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                    />
                    {formErrors.password && <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+244 900 000 000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                    {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuário *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "USER" | "ADMIN" | "EMPLOYEE") => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Usuário
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="EMPLOYEE">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Funcionário
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.role && <p className="text-sm text-red-500 mt-1">{formErrors.role}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Criando..." : "Criar Usuário"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
