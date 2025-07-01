import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Token administrativo não encontrado" }, { status: 401 })
    }

    const user = await getUserFromToken(token)

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Token administrativo inválido" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Admin auth me error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
