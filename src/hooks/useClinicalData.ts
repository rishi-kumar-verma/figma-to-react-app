import { useState } from "react";

export type TriageUrgency = "routine" | "urgent" | "emergency";
export type AppointmentStatus = "confirmed" | "in-consultation" | "completed" | "delayed";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mrn: string;
  roomBed?: string;
  primaryCondition: string;
  assignedDoctor: string;
  admissionDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  timeSlot: string;
  department: string;
  doctorName: string;
  urgency: TriageUrgency;
  status: AppointmentStatus;
}

export interface ClinicalMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  isPositive: boolean;
  category: "census" | "surgical" | "icu" | "triage";
}

export interface VitalTelemetry {
  patientId: string;
  patientName: string;
  heartRateBpm: number;
  spo2Percent: number;
  bloodPressure: string;
  status: "stable" | "elevated" | "critical";
  lastUpdated: string;
}

export function useClinicalData() {
  const [metrics] = useState<ClinicalMetric[]>([
    {
      id: "1",
      title: "Total Admitted Patients",
      value: "1,248",
      subtitle: "+12% vs last month",
      trend: "12.4%",
      isPositive: true,
      category: "census",
    },
    {
      id: "2",
      title: "Surgical Success Rate",
      value: "99.4%",
      subtitle: "+0.8% optimal recovery",
      trend: "0.8%",
      isPositive: true,
      category: "surgical",
    },
    {
      id: "3",
      title: "ICU Bed Occupancy",
      value: "82%",
      subtitle: "4 critical beds open",
      trend: "2.1%",
      isPositive: false,
      category: "icu",
    },
    {
      id: "4",
      title: "Average Triage Wait",
      value: "14 min",
      subtitle: "-4 mins faster",
      trend: "22%",
      isPositive: true,
      category: "triage",
    },
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: "apt-1",
      patientId: "p-101",
      patientName: "Eleanor Vance",
      timeSlot: "09:30 AM",
      department: "Cardiology",
      doctorName: "Dr. Aris Thorne",
      urgency: "urgent",
      status: "in-consultation",
    },
    {
      id: "apt-2",
      patientId: "p-102",
      patientName: "Marcus Sterling",
      timeSlot: "10:15 AM",
      department: "Trauma Surgery",
      doctorName: "Dr. Sarah Chen",
      urgency: "emergency",
      status: "confirmed",
    },
    {
      id: "apt-3",
      patientId: "p-103",
      patientName: "Sophia Hernandez",
      timeSlot: "11:00 AM",
      department: "Neurology",
      doctorName: "Dr. Aris Thorne",
      urgency: "routine",
      status: "confirmed",
    },
    {
      id: "apt-4",
      patientId: "p-104",
      patientName: "David Miller",
      timeSlot: "01:30 PM",
      department: "Orthopedics",
      doctorName: "Dr. James Wilson",
      urgency: "routine",
      status: "confirmed",
    },
  ]);

  const [telemetries] = useState<VitalTelemetry[]>([
    {
      patientId: "p-101",
      patientName: "Eleanor Vance (Bed 4A)",
      heartRateBpm: 74,
      spo2Percent: 99,
      bloodPressure: "120/78",
      status: "stable",
      lastUpdated: "Just now",
    },
    {
      patientId: "p-102",
      patientName: "Marcus Sterling (ICU 2)",
      heartRateBpm: 104,
      spo2Percent: 94,
      bloodPressure: "142/90",
      status: "elevated",
      lastUpdated: "1m ago",
    },
    {
      patientId: "p-105",
      patientName: "Clara Oswald (ICU 5)",
      heartRateBpm: 68,
      spo2Percent: 98,
      bloodPressure: "116/74",
      status: "stable",
      lastUpdated: "3m ago",
    },
  ]);

  return { metrics, appointments, telemetries };
}
