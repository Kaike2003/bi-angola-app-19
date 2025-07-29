"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";

// 🔒 Schema de validação com Zod
const profileSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto"),
  phone: z.string().min(9, "Telefone inválido").max(20, "Telefone muito longo"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  // Atualiza os valores padrão quando o usuário muda
  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { error } = await response.json();
        console.error("Erro ao atualizar:", error);
        return;
      }

      const { user: updatedUser } = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="BI Angola" subtitle="Meu Perfil" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">
                    {user?.fullName?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{user?.fullName || "Usuário"}</h3>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <Badge
                  className={user?.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}
                >
                  {user?.role === "ADMIN" ? "Administrador" : "Usuário"}
                </Badge>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Membro desde</p>
                  <p className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-PT") : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 🧾 Formulário */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações de contato</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      size="sm"
                      disabled={!isDirty}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* fullName */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    {isEditing ? (
                      <>
                        <Input id="fullName" {...register("fullName")} placeholder="Seu nome completo" />
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{user?.fullName || "Não informado"}</span>
                      </div>
                    )}
                  </div>

                  {/* email (não editável) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                  </div>

                  {/* phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    {isEditing ? (
                      <>
                        <Input id="phone" {...register("phone")} placeholder="+244 9XX XXX XXX" />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user?.phone || "Não informado"}</span>
                      </div>
                    )}
                  </div>

                  {/* role */}
                  <div className="space-y-2">
                    <Label>Tipo de Conta</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{user?.role === "ADMIN" ? "Administrador" : "Usuário Regular"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
