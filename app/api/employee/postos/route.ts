import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("employee-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const postos = await prisma.posto.findMany({
      include: {
        services: {
          include: {
            service: true,
          },
        },
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(postos);
  } catch (error) {
    console.error("Get postos error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("employee-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const {
      name,
      address,
      phone,
      email,
      hours,
      availability = "MEDIO",
      province,
      municipality,
      capacity = 100,
      manager,
      status = "ACTIVE",
      serviceIds = [],
    } = await request.json();

    if (!name || !address || !province || !municipality) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 });
    }

    // Create posto
    const posto = await prisma.posto.create({
      data: {
        name,
        address,
        phone: phone || null,
        email: email || null,
        hours,
        availability,
        province,
        municipality,
        capacity,
        manager: manager || null,
        status,
      },
    });

    // Link services if provided
    if (serviceIds.length > 0) {
      await prisma.postoService.createMany({
        data: serviceIds.map((serviceId: string) => ({
          postoId: posto.id,
          serviceId,
        })),
      });
    }

    // Return posto with services
    const postoWithServices = await prisma.posto.findUnique({
      where: { id: posto.id },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json({ posto: postoWithServices, message: "Posto criado com sucesso!" });
  } catch (error) {
    console.error("Create posto error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("employee-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);
    if (!currentUser || currentUser.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID do posto é obrigatório" }, { status: 400 });
    }

    // Deleta serviços vinculados ao posto (tabela intermediária)
    await prisma.postoService.deleteMany({
      where: { postoId: id },
    });

    // Deleta o posto
    await prisma.posto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Posto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar posto:", error);
    return NextResponse.json({ error: "Erro ao deletar posto" }, { status: 500 });
  }
}
