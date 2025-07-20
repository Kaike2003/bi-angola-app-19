import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("employee-auth-token")?.value;
    console.log(token);
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    console.log(token);
    if (!currentUser || currentUser.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
        service: true,
        posto: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
