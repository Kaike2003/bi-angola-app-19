import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
      }

      return NextResponse.json(service);
    }

    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Erro ao buscar serviços" }, { status: 500 });
  }
}
