// /app/api/admin/data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
  const [users, postos, services, appointments] = await Promise.all([
    prisma.user.findMany(),
    prisma.posto.findMany(),
    prisma.service.findMany(),
    prisma.appointment.findMany(),
  ]);

  return NextResponse.json({ users, postos, services, appointments });
}
