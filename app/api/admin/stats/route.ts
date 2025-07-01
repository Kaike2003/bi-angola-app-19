import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token administrativo não encontrado" }, { status: 401 });
    }

    const adminUser = await getUserFromToken(token);
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    // Contagens totais
    const [totalUsers, totalAppointments, totalServices, totalPostos] = await Promise.all([
      prisma.user.count(),
      prisma.appointment.count(),
      prisma.service.count(),
      prisma.posto.count(),
    ]);

    // Agrupamentos
    const appointmentStats = await prisma.appointment.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const userStats = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    const postoStats = await prisma.posto.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const recentAppointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { fullName: true, email: true } },
        service: { select: { name: true } },
        posto: { select: { name: true } },
      },
    });

    const totalRecentAppointments = await prisma.appointment.count(); // Para paginação

    return NextResponse.json({
      totals: {
        users: totalUsers,
        appointments: totalAppointments,
        services: totalServices,
        postos: totalPostos,
      },
      appointmentStats,
      userStats,
      postoStats,
      recentAppointments,
      pagination: {
        page,
        limit,
        total: totalRecentAppointments,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
