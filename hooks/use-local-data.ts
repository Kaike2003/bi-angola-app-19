"use client";

import { useState, useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  cost: string;
  requirements?: string[];
  category: string;
  isActive: boolean;
}

interface Posto {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours: string;
  availability: string;
  province: string;
  municipality: string;
  capacity: number;
  manager?: string;
  status: string;
  services: string[];
}

interface Appointment {
  id: string;
  referenceNumber: string;
  userId: string;
  serviceId: string;
  postoId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  service?: Service;
  posto?: Posto;
}

export function useLocalData() {
  const [services, setServices] = useState<Service[]>([]);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, postosRes, appointmentsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/postos"),
        fetch("/api/appointments", { credentials: "include" }),
      ]);

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      if (postosRes.ok) {
        const postosData = await postosRes.json();
        setPostos(postosData);
      }

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = () => services;

  const getPostos = () => postos;

  const getAppointments = async () => {
    try {
      const appointmentsRes = await fetch("/api/appointments", { credentials: "include" });

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      }
      return a
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = (id: string) => services.find((service) => service.id === id) || null;

  const getPostoById = (id: string) => postos.find((posto) => posto.id === id) || null;

  const getAppointmentById = (id: string) => appointments.find((appointment) => appointment.id === id) || null;

  const getAppointmentsWithDetails = (userId?: string) => {
    const userAppointments = userId ? appointments.filter((apt) => apt.userId === userId) : appointments;

    return userAppointments.map((appointment) => ({
      ...appointment,
      service: getServiceById(appointment.serviceId),
      posto: getPostoById(appointment.postoId),
    }));
  };

  const createAppointment = async (appointmentData: {
    userId: string;
    serviceId: string;
    postoId: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar agendamento");
      }

      const newAppointment = await response.json();
      setAppointments((prev) => [newAppointment, ...prev]);
      return newAppointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar agendamento");
      }

      const updatedAppointment = await response.json();
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? updatedAppointment : apt)));
      return updatedAppointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao cancelar agendamento");
      }

      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      return true;
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error;
    }
  };

  const refreshData = () => {
    loadData();
  };

  return {
    services,
    postos,
    appointments,
    loading,
    getServices,
    getPostos,
    getAppointments,
    getServiceById,
    getPostoById,
    getAppointmentById,
    getAppointmentsWithDetails,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    refreshData,
  };
}
