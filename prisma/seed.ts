import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await prisma.appointment.deleteMany()
  await prisma.postoService.deleteMany()
  await prisma.service.deleteMany()
  await prisma.posto.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@bi.gov.ao",
      password: adminPassword,
      fullName: "Administrador do Sistema",
      phone: "+244 923 000 001",
      role: "ADMIN",
    },
  })

  // Create regular users
  const userPassword = await bcrypt.hash("user123", 10)
  const user1 = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: userPassword,
      fullName: "João Silva",
      phone: "+244 923 456 789",
      role: "USER",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "maria@example.com",
      password: await bcrypt.hash("maria123", 10),
      fullName: "Maria Santos",
      phone: "+244 924 567 890",
      role: "USER",
    },
  })

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: "Primeira Emissão",
      description: "Para cidadãos que solicitam o primeiro Bilhete de Identidade",
      duration: "30-45 min",
      price: "8.500 AKZ",
      requirements: [
        "Certidão de nascimento original",
        "2 fotografias tipo passe",
        "Comprovativo de residência",
        "Presença do requerente",
      ],
      category: "EMISSION",
    },
  })

  const service2 = await prisma.service.create({
    data: {
      name: "Renovação",
      description: "Renovação do Bilhete de Identidade expirado ou por expirar",
      duration: "20-30 min",
      price: "6.500 AKZ",
      requirements: [
        "Bilhete de Identidade anterior",
        "2 fotografias tipo passe",
        "Comprovativo de residência atualizado",
      ],
      category: "RENEWAL",
    },
  })

  const service3 = await prisma.service.create({
    data: {
      name: "Segunda Via",
      description: "Emissão de segunda via por perda, roubo ou danos",
      duration: "30-40 min",
      price: "8.500 AKZ",
      requirements: [
        "Declaração de perda/roubo (se aplicável)",
        "Certidão de nascimento",
        "2 fotografias tipo passe",
        "Comprovativo de residência",
        "Testemunhas (se necessário)",
      ],
      category: "REPLACEMENT",
    },
  })

  const service4 = await prisma.service.create({
    data: {
      name: "Actualização de Dados",
      description: "Alteração de dados pessoais no Bilhete de Identidade",
      duration: "25-35 min",
      price: "7.000 AKZ",
      requirements: [
        "Bilhete de Identidade atual",
        "Documentos que comprovem a alteração",
        "2 fotografias tipo passe",
        "Comprovativo de residência",
      ],
      category: "UPDATE",
    },
  })

  // Create postos
  const posto1 = await prisma.posto.create({
    data: {
      name: "Posto Central de Luanda",
      address: "Rua Major Kanhangulo, Ingombota, Luanda",
      phone: "+244 222 334 567",
      email: "luanda.central@bi.gov.ao",
      hours: "08:00 - 16:00",
      availability: "ALTO",
      province: "Luanda",
      municipality: "Ingombota",
      capacity: 150,
      manager: "Dr. Carlos Mendes",
      status: "ACTIVE",
    },
  })

  const posto2 = await prisma.posto.create({
    data: {
      name: "Posto da Maianga",
      address: "Rua Rainha Ginga, Maianga, Luanda",
      phone: "+244 222 445 678",
      email: "maianga@bi.gov.ao",
      hours: "08:00 - 16:00",
      availability: "MEDIO",
      province: "Luanda",
      municipality: "Maianga",
      capacity: 100,
      manager: "Dra. Ana Rodrigues",
      status: "ACTIVE",
    },
  })

  const posto3 = await prisma.posto.create({
    data: {
      name: "Posto Central de Benguela",
      address: "Rua Silva Porto, Centro, Benguela",
      phone: "+244 272 234 567",
      email: "benguela.central@bi.gov.ao",
      hours: "08:00 - 15:30",
      availability: "BAIXO",
      province: "Benguela",
      municipality: "Benguela",
      capacity: 80,
      manager: "Dr. Manuel pricea",
      status: "ACTIVE",
    },
  })

  // Link services to postos
  await prisma.postoService.createMany({
    data: [
      { postoId: posto1.id, serviceId: service1.id },
      { postoId: posto1.id, serviceId: service2.id },
      { postoId: posto1.id, serviceId: service3.id },
      { postoId: posto1.id, serviceId: service4.id },
      { postoId: posto2.id, serviceId: service1.id },
      { postoId: posto2.id, serviceId: service2.id },
      { postoId: posto2.id, serviceId: service4.id },
      { postoId: posto3.id, serviceId: service1.id },
      { postoId: posto3.id, serviceId: service2.id },
      { postoId: posto3.id, serviceId: service3.id },
    ],
  })

  // Create sample appointments
  await prisma.appointment.create({
    data: {
      referenceNumber: "AG2024001234",
      appointmentDate: "2024-03-18",
      appointmentTime: "14:00",
      status: "SCHEDULED",
      notes: "Primeira emissão para cidadão jovem",
      userId: user1.id,
      serviceId: service1.id,
      postoId: posto1.id,
    },
  })

  await prisma.appointment.create({
    data: {
      referenceNumber: "AG2024001235",
      appointmentDate: "2024-03-19",
      appointmentTime: "10:30",
      status: "COMPLETED",
      notes: "Renovação processada com sucesso",
      userId: user2.id,
      serviceId: service2.id,
      postoId: posto2.id,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log("👤 Admin: admin@bi.gov.ao / admin123")
  console.log("👤 User: user@example.com / user123")
  console.log("👤 User: maria@example.com / maria123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
