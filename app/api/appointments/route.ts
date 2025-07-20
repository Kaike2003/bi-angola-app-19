import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, generateReferenceNumber } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const where = user.role === "ADMIN" ? {} : { userId: user.id };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        service: true,
        posto: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { serviceId, postoId, appointmentDate, appointmentTime, notes } = await request.json();

    if (!serviceId || !postoId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 });
    }

    // Check if time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        postoId,
        appointmentDate,
        appointmentTime,
        status: "SCHEDULED",
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Horário não disponível" }, { status: 409 });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        referenceNumber: generateReferenceNumber(),
        userId: user.id,
        serviceId,
        postoId,
        appointmentDate,
        appointmentTime,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        service: true,
        posto: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}
