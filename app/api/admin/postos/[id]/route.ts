import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 })
    }

    const currentUser = await getUserFromToken(token)
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const {
      name,
      address,
      phone,
      email,
      hours,
      availability,
      province,
      municipality,
      capacity,
      manager,
      status,
      serviceIds = [],
    } = await request.json()

    // Update posto
    const posto = await prisma.posto.update({
      where: { id: params.id },
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
    })

    // Update services
    await prisma.postoService.deleteMany({
      where: { postoId: params.id },
    })

    if (serviceIds.length > 0) {
      await prisma.postoService.createMany({
        data: serviceIds.map((serviceId: string) => ({
          postoId: params.id,
          serviceId,
        })),
      })
    }

    // Return updated posto with services
    const postoWithServices = await prisma.posto.findUnique({
      where: { id: params.id },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    })

    return NextResponse.json({ posto: postoWithServices, message: "Posto atualizado com sucesso!" })
  } catch (error) {
    console.error("Update posto error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Token de acesso necessário" }, { status: 401 })
    }

    const currentUser = await getUserFromToken(token)
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    await prisma.posto.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Posto deletado com sucesso!" })
  } catch (error) {
    console.error("Delete posto error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
