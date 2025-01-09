"use client";
import React, { useEffect, useState } from "react";
import { usePrescriptions } from "@/context/PrescriptionContext";
import "./Prescription.css"; // Import the CSS file
import PrescriptionModal from "./PrescriptionModal";

const PrescriptionCard = ({ prescription, handleComplete }) => {

  const [activeMedicine, setActiveMedicine] = useState(0);

  return (

    <div className="prescription-card">
      <h3 className="prescription-diagnosis">
        Diagnosis: {prescription.diagnosis}
      </h3>
      <p>
        <strong>Symptoms:</strong> {prescription.symptoms}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(prescription.date).toLocaleDateString()}
      </p>
      <div className="medicine-tabs">
        {prescription.medicines.map((med, index) => (
          <button
            key={med._id}
            className={`medicine-tab ${
              activeMedicine === index ? "active" : ""
            }`}
            onClick={() => setActiveMedicine(index)}
          >
            {med.name}
          </button>
        ))}
      </div>
      <div className="medicine-details">
        <p>
          <strong>Dosage:</strong> {prescription.medicines[activeMedicine].dosage}
        </p>
        <p>
          <strong>Duration:</strong> {prescription.medicines[activeMedicine].duration} days
        </p>
        <p>
          <strong>Notes:</strong> {prescription.medicines[activeMedicine].notes}
        </p>
      </div>
      <p className="capitalize">
        <strong>Status:</strong> {prescription.status}
      </p>
      {prescription.status === "pending" && (
        <button
          className="prescription-button"
          onClick={() => handleComplete(prescription._id)}
        >
          Completed
        </button>
      )}
      {prescription.status === "completed" && (
        <div>
          <p>
            <strong>Completed on:</strong>{" "}
            {new Date(prescription.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};


const Prescription = () => {
  const { prescriptions, setPrescriptions } = usePrescriptions();
  const [activeTab, setActiveTab] = useState("pending");
  const [addingPrescription, setAddingPrescription] = useState(false);

  const [filteredPrescriptions, setFilteredPrescriptions] =
    useState(prescriptions);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (activeTab === "pending") {
      setFilteredPrescriptions(
        prescriptions.filter(
          (prescription) => prescription.status === "pending"
        )
      );
    } else if (activeTab === "completed") {
      setFilteredPrescriptions(
        prescriptions.filter(
          (prescription) => prescription.status === "completed"
        )
      );
    } else {
      setFilteredPrescriptions(prescriptions);
    }
  }, [activeTab, prescriptions]);

  const handleComplete = (id) => {
    fetch(`/api/update-prescription`, {
      method: "PUT",
      body: JSON.stringify({ id, status: "completed" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedPrescriptions = prescriptions.map((prescription) => {
            if (prescription._id === id) {
              return { ...prescription, status: "completed" };
            }
            return prescription;
          });
          setPrescriptions(updatedPrescriptions);
          alert(data.message);
        }
      });
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-gradient-to-r prescription-container from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b-4 border-blue-500 pb-2">
          Prescriptions
        </h1>
        <button
          onClick={() => setAddingPrescription(true)}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          + New Prescription
        </button>
      </div>

      <div className="prescription-tabs">
        <button
          className={`prescription-tab ${
            activeTab === "pending" ? "active" : "not-active"
          }`}
          onClick={() => handleTabChange("pending")}
        >
          Pending
        </button>
        <button
          className={`prescription-tab ${
            activeTab === "completed" ? "active" : "not-active"
          }`}
          onClick={() => handleTabChange("completed")}
        >
          Completed
        </button>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <p className="text-black">No prescriptions available.</p>
      ) : (
        <div className="prescription-list">
          {prescriptions.map((prescription) => {
              
              return (
                <PrescriptionCard
                  key={prescription._id}
                  prescription={prescription}
                  handleComplete={handleComplete}
                />
              );
          })}
        </div>
      )}
      {
        addingPrescription && <PrescriptionModal 
              onClose={() => setAddingPrescription(false)}
        />
      }
    </div>
  );
};

export default Prescription;
