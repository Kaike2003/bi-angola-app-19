"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context"; // ✅ importar contexto

export default function PerfilPage() {
  const { user, updateUser } = useAuth(); // ✅ usar updateUser
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  console.log(user)

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        console.error("Erro ao atualizar:", error);
        return;
      }

      const { user: updatedUser } = await response.json();

      console.log("Usuário atualizado:", updatedUser);

      updateUser(updatedUser); // ✅ atualiza o usuário no contexto
      setIsEditing(false);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
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
            {/* Profile Card */}
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

            {/* Information Card */}
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
                    <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
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
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{user?.fullName || "Não informado"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+244 9XX XXX XXX"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user?.phone || "Não informado"}</span>
                      </div>
                    )}
                  </div>

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
