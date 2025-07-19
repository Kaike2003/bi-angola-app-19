import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/admin-auth-token=([^;]+)/)?.[1];
    if (!token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const [users, postos, agendamentos, servicos, postoService] = await Promise.all([
      prisma.user.findMany(),
      prisma.posto.findMany({
        include: { services: { include: { service: true } } },
      }),
      prisma.appointment.findMany({
        include: { user: true, posto: true, service: true },
      }),
      prisma.service.findMany(),
      prisma.postoService.findMany(),
    ]);

    return NextResponse.json({
      users,
      postos,
      agendamentos,
      servicos,
      postoService,
    });
  } catch (err) {
    console.error("Erro ao exportar dados:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
