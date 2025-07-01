import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const posto = await prisma.posto.findUnique({
        where: { id },
      })

      if (!posto) {
        return NextResponse.json({ error: "Posto não encontrado" }, { status: 404 })
      }

      return NextResponse.json(posto)
    }

    const postos = await prisma.posto.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(postos)
  } catch (error) {
    console.error("Error fetching postos:", error)
    return NextResponse.json({ error: "Erro ao buscar postos" }, { status: 500 })
  }
}
