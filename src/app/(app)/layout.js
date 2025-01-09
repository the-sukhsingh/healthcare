"use client";
import { DoctorProvider } from "@/context/DoctorContext";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { PrescriptionProvider } from "@/context/PrescriptionContext";
export default function RootLayout({ children }) {
  return (
    <main>
      <DoctorProvider>
        <AppointmentProvider>
          <PrescriptionProvider>{children}</PrescriptionProvider>
          </AppointmentProvider>
      </DoctorProvider>
    </main>
  );
}
