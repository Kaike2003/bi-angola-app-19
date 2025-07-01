// Dados locais para desenvolvimento
export interface User {
  id: string
  email: string
  password: string
  fullName?: string
  phone?: string
  role: "USER" | "ADMIN"
  createdAt: string
  updatedAt: string
}

export interface Posto {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  hours: string
  availability: "Alto" | "Médio" | "Baixo"
  province: string
  municipality: string
  coordinates?: {
    lat: number
    lng: number
  }
  capacity: number
  services: string[]
  manager?: string
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: string
  cost: string
  requirements: string[]
  category: "EMISSION" | "RENEWAL" | "UPDATE" | "REPLACEMENT"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  userId: string
  serviceId: string
  postoId: string
  appointmentDate: string
  appointmentTime: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  referenceNumber: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Províncias de Angola
export const provinces = [
  "Luanda",
  "Benguela",
  "Huambo",
  "Lobito",
  "Cabinda",
  "Huíla",
  "Namibe",
  "Moxico",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Uíge",
  "Zaire",
  "Cuanza Norte",
  "Cuanza Sul",
  "Bié",
  "Cuando Cubango",
  "Cunene",
]

// Dados mock expandidos
export const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@bi.gov.ao",
    password: "admin123",
    fullName: "Administrador do Sistema",
    phone: "+244 923 000 001",
    role: "ADMIN",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-1",
    email: "user@example.com",
    password: "user123",
    fullName: "João Silva",
    phone: "+244 923 456 789",
    role: "USER",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "user-2",
    email: "maria@example.com",
    password: "maria123",
    fullName: "Maria Santos",
    phone: "+244 924 567 890",
    role: "USER",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "user-3",
    email: "antonio@example.com",
    password: "antonio123",
    fullName: "António Fernandes",
    phone: "+244 925 678 901",
    role: "USER",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
]

export const mockPostos: Posto[] = [
  {
    id: "posto-1",
    name: "Posto Central de Luanda",
    address: "Rua Major Kanhangulo, Ingombota, Luanda",
    phone: "+244 222 334 567",
    email: "luanda.central@bi.gov.ao",
    hours: "08:00 - 16:00",
    availability: "Alto",
    province: "Luanda",
    municipality: "Ingombota",
    coordinates: { lat: -8.839, lng: 13.2894 },
    capacity: 150,
    services: ["service-1", "service-2", "service-3", "service-4"],
    manager: "Dr. Carlos Mendes",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "posto-2",
    name: "Posto da Maianga",
    address: "Rua Rainha Ginga, Maianga, Luanda",
    phone: "+244 222 445 678",
    email: "maianga@bi.gov.ao",
    hours: "08:00 - 16:00",
    availability: "Médio",
    province: "Luanda",
    municipality: "Maianga",
    coordinates: { lat: -8.82, lng: 13.24 },
    capacity: 100,
    services: ["service-1", "service-2", "service-4"],
    manager: "Dra. Ana Rodrigues",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "posto-3",
    name: "Posto Central de Benguela",
    address: "Rua Silva Porto, Centro, Benguela",
    phone: "+244 272 234 567",
    email: "benguela.central@bi.gov.ao",
    hours: "08:00 - 15:30",
    availability: "Baixo",
    province: "Benguela",
    municipality: "Benguela",
    coordinates: { lat: -12.5763, lng: 13.4055 },
    capacity: 80,
    services: ["service-1", "service-2", "service-3"],
    manager: "Dr. Manuel Costa",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "posto-4",
    name: "Posto Central do Huambo",
    address: "Rua José Martí, Centro, Huambo",
    phone: "+244 241 234 567",
    email: "huambo.central@bi.gov.ao",
    hours: "08:00 - 15:30",
    availability: "Alto",
    province: "Huambo",
    municipality: "Huambo",
    coordinates: { lat: -12.7756, lng: 15.7395 },
    capacity: 120,
    services: ["service-1", "service-2", "service-3", "service-4"],
    manager: "Dra. Isabel Neto",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "posto-5",
    name: "Posto de Cabinda",
    address: "Avenida da Independência, Cabinda",
    phone: "+244 231 234 567",
    email: "cabinda@bi.gov.ao",
    hours: "08:00 - 16:00",
    availability: "Médio",
    province: "Cabinda",
    municipality: "Cabinda",
    coordinates: { lat: -5.55, lng: 12.2 },
    capacity: 90,
    services: ["service-1", "service-2", "service-4"],
    manager: "Dr. Pedro Silva",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Primeira Emissão",
    description: "Para cidadãos que solicitam o primeiro Bilhete de Identidade",
    duration: "30-45 min",
    cost: "8.500 AKZ",
    requirements: [
      "Certidão de nascimento original",
      "2 fotografias tipo passe",
      "Comprovativo de residência",
      "Presença do requerente",
    ],
    category: "EMISSION",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "service-2",
    name: "Renovação",
    description: "Renovação do Bilhete de Identidade expirado ou por expirar",
    duration: "20-30 min",
    cost: "6.500 AKZ",
    requirements: [
      "Bilhete de Identidade anterior",
      "2 fotografias tipo passe",
      "Comprovativo de residência atualizado",
    ],
    category: "RENEWAL",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "service-3",
    name: "Segunda Via",
    description: "Emissão de segunda via por perda, roubo ou danos",
    duration: "30-40 min",
    cost: "8.500 AKZ",
    requirements: [
      "Declaração de perda/roubo (se aplicável)",
      "Certidão de nascimento",
      "2 fotografias tipo passe",
      "Comprovativo de residência",
      "Testemunhas (se necessário)",
    ],
    category: "REPLACEMENT",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "service-4",
    name: "Actualização de Dados",
    description: "Alteração de dados pessoais no Bilhete de Identidade",
    duration: "25-35 min",
    cost: "7.000 AKZ",
    requirements: [
      "Bilhete de Identidade atual",
      "Documentos que comprovem a alteração",
      "2 fotografias tipo passe",
      "Comprovativo de residência",
    ],
    category: "UPDATE",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: "appointment-1",
    userId: "user-1",
    serviceId: "service-1",
    postoId: "posto-1",
    appointmentDate: "2024-03-18",
    appointmentTime: "14:00",
    status: "SCHEDULED",
    referenceNumber: "AG2024001234",
    notes: "Primeira emissão para cidadão jovem",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "appointment-2",
    userId: "user-2",
    serviceId: "service-2",
    postoId: "posto-2",
    appointmentDate: "2024-03-19",
    appointmentTime: "10:30",
    status: "COMPLETED",
    referenceNumber: "AG2024001235",
    notes: "Renovação processada com sucesso",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "appointment-3",
    userId: "user-1",
    serviceId: "service-3",
    postoId: "posto-1",
    appointmentDate: "2024-03-20",
    appointmentTime: "09:00",
    status: "CANCELLED",
    referenceNumber: "AG2024001236",
    notes: "Cancelado a pedido do cliente",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
  {
    id: "appointment-4",
    userId: "user-3",
    serviceId: "service-4",
    postoId: "posto-3",
    appointmentDate: "2024-03-21",
    appointmentTime: "15:30",
    status: "SCHEDULED",
    referenceNumber: "AG2024001237",
    notes: "Atualização de endereço",
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z",
  },
  {
    id: "appointment-5",
    userId: "user-2",
    serviceId: "service-1",
    postoId: "posto-4",
    appointmentDate: "2024-03-22",
    appointmentTime: "11:00",
    status: "NO_SHOW",
    referenceNumber: "AG2024001238",
    notes: "Cliente não compareceu",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
]

// Funções helper para trabalhar com os dados
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function generateReferenceNumber(): string {
  return `AG${new Date().getFullYear()}${String(Date.now()).slice(-6)}`
}

// Simulação de delay para APIs (opcional)
export function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
