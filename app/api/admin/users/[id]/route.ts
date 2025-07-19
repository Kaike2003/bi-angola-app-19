import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, hashPassword } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { email, password, fullName, phone, role } = await request.json();

    const updateData: any = {
      email: email?.toLowerCase(),
      fullName,
      phone: phone || null,
      role,
    };

    // Only update password if provided
    if (password && password.length >= 6) {
      updateData.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user, message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    // Don't allow deleting yourself
    if (currentUser.id === params.id) {
      return NextResponse.json({ error: "Você não pode deletar sua própria conta" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
