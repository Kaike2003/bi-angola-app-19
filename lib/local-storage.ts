import {
  mockUsers,
  mockPostos,
  mockServices,
  mockAppointments,
  generateId,
  generateReferenceNumber,
  type User,
  type Posto,
  type Service,
  type Appointment,
} from "./mock-data"

// Chaves para localStorage
const STORAGE_KEYS = {
  USERS: "bi-angola-users",
  POSTOS: "bi-angola-postos",
  SERVICES: "bi-angola-services",
  APPOINTMENTS: "bi-angola-appointments",
  CURRENT_USER: "bi-angola-current-user",
}

// Funções para gerenciar dados no localStorage
class LocalDataManager {
  // Verificar se estamos no browser
  private isBrowser(): boolean {
    return typeof window !== "undefined"
  }

  // Inicializar dados se não existirem
  initializeData() {
    if (!this.isBrowser()) return

    // Inicializar usuários
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
    }

    // Inicializar postos
    if (!localStorage.getItem(STORAGE_KEYS.POSTOS)) {
      localStorage.setItem(STORAGE_KEYS.POSTOS, JSON.stringify(mockPostos))
    }

    // Inicializar serviços
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mockServices))
    }

    // Inicializar agendamentos
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(mockAppointments))
    }
  }

  // Users
  getUsers(): User[] {
    if (!this.isBrowser()) return mockUsers
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : mockUsers
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.id === id) || null
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.email === email) || null
  }

  createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const users = this.getUsers()
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    }
    return newUser
  }

  updateUser(id: string, userData: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    }
    return users[userIndex]
  }

  // Current User
  getCurrentUser(): User | null {
    if (!this.isBrowser()) return null
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return userData ? JSON.parse(userData) : null
  }

  setCurrentUser(user: User | null): void {
    if (!this.isBrowser()) return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  }

  // Postos
  getPostos(): Posto[] {
    if (!this.isBrowser()) return mockPostos
    const data = localStorage.getItem(STORAGE_KEYS.POSTOS)
    return data ? JSON.parse(data) : mockPostos
  }

  getPostoById(id: string): Posto | null {
    const postos = this.getPostos()
    return postos.find((posto) => posto.id === id) || null
  }

  createPosto(postoData: Omit<Posto, "id" | "createdAt" | "updatedAt">): Posto {
    const postos = this.getPostos()
    const newPosto: Posto = {
      ...postoData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    postos.push(newPosto)
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.POSTOS, JSON.stringify(postos))
    }
    return newPosto
  }

  updatePosto(id: string, postoData: Partial<Posto>): Posto | null {
    const postos = this.getPostos()
    const postoIndex = postos.findIndex((posto) => posto.id === id)

    if (postoIndex === -1) return null

    postos[postoIndex] = {
      ...postos[postoIndex],
      ...postoData,
      updatedAt: new Date().toISOString(),
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.POSTOS, JSON.stringify(postos))
    }
    return postos[postoIndex]
  }

  deletePosto(id: string): boolean {
    const postos = this.getPostos()
    const filteredPostos = postos.filter((posto) => posto.id !== id)

    if (filteredPostos.length === postos.length) return false

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.POSTOS, JSON.stringify(filteredPostos))
    }
    return true
  }

  // Services
  getServices(): Service[] {
    if (!this.isBrowser()) return mockServices
    const data = localStorage.getItem(STORAGE_KEYS.SERVICES)
    return data ? JSON.parse(data) : mockServices
  }

  getServiceById(id: string): Service | null {
    const services = this.getServices()
    return services.find((service) => service.id === id) || null
  }

  createService(serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">): Service {
    const services = this.getServices()
    const newService: Service = {
      ...serviceData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    services.push(newService)
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
    }
    return newService
  }

  updateService(id: string, serviceData: Partial<Service>): Service | null {
    const services = this.getServices()
    const serviceIndex = services.findIndex((service) => service.id === id)

    if (serviceIndex === -1) return null

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...serviceData,
      updatedAt: new Date().toISOString(),
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
    }
    return services[serviceIndex]
  }

  deleteService(id: string): boolean {
    const services = this.getServices()
    const filteredServices = services.filter((service) => service.id !== id)

    if (filteredServices.length === services.length) return false

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filteredServices))
    }
    return true
  }

  // Appointments
  getAppointments(): Appointment[] {
    if (!this.isBrowser()) return mockAppointments
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)
    return data ? JSON.parse(data) : mockAppointments
  }

  getAppointmentById(id: string): Appointment | null {
    const appointments = this.getAppointments()
    return appointments.find((appointment) => appointment.id === id) || null
  }

  getAppointmentsByUserId(userId: string): Appointment[] {
    const appointments = this.getAppointments()
    return appointments.filter((appointment) => appointment.userId === userId)
  }

  createAppointment(appointmentData: {
    userId: string
    serviceId: string
    postoId: string
    appointmentDate: string
    appointmentTime: string
    notes?: string
  }): Appointment {
    const appointments = this.getAppointments()
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId(),
      status: "SCHEDULED",
      referenceNumber: generateReferenceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    appointments.push(newAppointment)

    // Debug logs
    console.log("Creating appointment:", newAppointment)
    console.log("Total appointments after creation:", appointments.length)

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments))
      // Verificar se foi salvo corretamente
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)
      console.log("Appointments saved to localStorage:", saved ? JSON.parse(saved).length : 0)
    }

    return newAppointment
  }

  updateAppointmentStatus(id: string, status: Appointment["status"]): Appointment | null {
    const appointments = this.getAppointments()
    const appointmentIndex = appointments.findIndex((appointment) => appointment.id === id)

    if (appointmentIndex === -1) return null

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments))
    }
    return appointments[appointmentIndex]
  }

  deleteAppointment(id: string): boolean {
    const appointments = this.getAppointments()
    const filteredAppointments = appointments.filter((appointment) => appointment.id !== id)

    if (filteredAppointments.length === appointments.length) return false

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filteredAppointments))
    }
    return true
  }

  // Reset all data
  resetData() {
    if (!this.isBrowser()) return

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
    localStorage.setItem(STORAGE_KEYS.POSTOS, JSON.stringify(mockPostos))
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mockServices))
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(mockAppointments))
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  // Método para debug - adicionar no final da classe
  debugData() {
    if (!this.isBrowser()) return

    console.log("=== DEBUG LOCAL STORAGE ===")
    console.log("Users:", this.getUsers().length)
    console.log("Postos:", this.getPostos().length)
    console.log("Services:", this.getServices().length)
    console.log("Appointments:", this.getAppointments().length)
    console.log("Current User:", this.getCurrentUser())
    console.log("========================")
  }
}

export const localData = new LocalDataManager()
