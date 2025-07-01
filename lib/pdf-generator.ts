import jsPDF from "jspdf"

interface AppointmentData {
  referenceNumber: string
  userName: string
  userEmail: string
  serviceName: string
  serviceDescription?: string
  serviceCost: string
  serviceDuration: string
  postoName: string
  postoAddress: string
  postoPhone?: string
  appointmentDate: string
  appointmentTime: string
  status: string
  createdAt: string
}

export function generateAppointmentPDF(data: AppointmentData): void {
  const doc = new jsPDF()

  // Configurações
  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  let yPosition = 30

  // Header - Logo e título
  doc.setFillColor(220, 38, 38) // Red color
  doc.rect(0, 0, pageWidth, 25, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("BI ANGOLA", margin, 17)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Sistema de Agendamento Digital", pageWidth - margin - 60, 17)

  // Reset text color
  doc.setTextColor(0, 0, 0)
  yPosition = 40

  // Título do documento
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("COMPROVATIVO DE AGENDAMENTO", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 20

  // Número de referência destacado
  doc.setFillColor(248, 250, 252)
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, "F")
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Número de Referência:", margin + 5, yPosition + 5)
  doc.setTextColor(220, 38, 38)
  doc.text(data.referenceNumber, margin + 5, yPosition + 12)
  doc.setTextColor(0, 0, 0)
  yPosition += 30

  // Informações do usuário
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("DADOS DO REQUERENTE", margin, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Nome: ${data.userName}`, margin + 5, yPosition)
  yPosition += 7
  doc.text(`Email: ${data.userEmail}`, margin + 5, yPosition)
  yPosition += 15

  // Informações do serviço
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("SERVIÇO SOLICITADO", margin, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Serviço: ${data.serviceName}`, margin + 5, yPosition)
  yPosition += 7
  if (data.serviceDescription) {
    const descLines = doc.splitTextToSize(`Descrição: ${data.serviceDescription}`, pageWidth - 2 * margin - 10)
    doc.text(descLines, margin + 5, yPosition)
    yPosition += descLines.length * 7
  }
  doc.text(`Duração Estimada: ${data.serviceDuration}`, margin + 5, yPosition)
  yPosition += 7
  doc.text(`Custo: ${data.serviceCost}`, margin + 5, yPosition)
  yPosition += 15

  // Informações do posto
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("LOCAL DE ATENDIMENTO", margin, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Posto: ${data.postoName}`, margin + 5, yPosition)
  yPosition += 7
  const addressLines = doc.splitTextToSize(`Endereço: ${data.postoAddress}`, pageWidth - 2 * margin - 10)
  doc.text(addressLines, margin + 5, yPosition)
  yPosition += addressLines.length * 7
  if (data.postoPhone) {
    doc.text(`Telefone: ${data.postoPhone}`, margin + 5, yPosition)
    yPosition += 7
  }
  yPosition += 8

  // Informações da data e hora
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("DATA E HORA DO ATENDIMENTO", margin, yPosition)
  yPosition += 10

  doc.setFillColor(254, 226, 226)
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, "F")
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(
    `Data: ${new Date(data.appointmentDate).toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin + 5,
    yPosition + 5,
  )
  doc.text(`Hora: ${data.appointmentTime}`, margin + 5, yPosition + 12)
  yPosition += 35

  // Status
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Status: ${getStatusText(data.status)}`, margin + 5, yPosition)
  yPosition += 15

  // Instruções importantes
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("INSTRUÇÕES IMPORTANTES", margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const instructions = [
    "• Chegue 15 minutos antes do horário marcado",
    "• Traga todos os documentos necessários",
    "• Em caso de impossibilidade, cancele ou reagende com antecedência",
    "• Guarde este comprovativo para apresentar no posto",
    "• Para alterações, entre em contato através do sistema ou telefone do posto",
  ]

  instructions.forEach((instruction) => {
    doc.text(instruction, margin + 5, yPosition)
    yPosition += 6
  })

  yPosition += 10

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(`Documento gerado em: ${new Date().toLocaleString("pt-PT")}`, margin, yPosition)
  doc.text("Sistema Oficial do Governo de Angola", pageWidth - margin - 50, yPosition)

  // Linha de rodapé
  doc.setDrawColor(220, 38, 38)
  doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5)

  // Download do PDF
  doc.save(`agendamento-${data.referenceNumber}.pdf`)
}

function getStatusText(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "Agendado"
    case "COMPLETED":
      return "Concluído"
    case "CANCELLED":
      return "Cancelado"
    case "NO_SHOW":
      return "Não Compareceu"
    default:
      return status
  }
}
