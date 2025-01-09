"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  useEffect(() => {
    fetch("/api/get-prescription")
      .then((response) => response.json())
      .then((data) => setPrescriptions(data.data));
  }, []);
  return (
    <PrescriptionContext.Provider value={{ prescriptions, setPrescriptions }}>
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptions = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error(
      "usePrescriptions must be used within an PrescriptionProvider"
    );
  }
  return context;
};
