import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            appointments: true,
            postos: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { name, description, duration, price, requirements = [], category, isActive = true } = await request.json();

    if (!name || !duration || !price || !category) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration,
        price,
        requirements,
        category,
        isActive,
      },
    });

    return NextResponse.json({ service, message: "Serviço criado com sucesso!" });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
