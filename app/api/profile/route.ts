import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth"; // Se quiser autenticação via token

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone } = body;

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    console.log(user)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        email,
        phone,
      },
    });

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
