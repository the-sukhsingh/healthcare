"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppointmentContext = createContext();


export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
      fetch("/api/get-appointment")
      .then((response) => response.json())
      .then((data) => setAppointments(data.data));

  }, []);
  return (
    <AppointmentContext.Provider value={{ appointments,setAppointments }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
