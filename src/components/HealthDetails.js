"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

const defaultVitalSigns = {
  height: "",
  weight: "",
  bloodPressure: {
    systolic: "",
    diastolic: "",
  },
  temperature: "",
  pulseRate: "",
  respiratoryRate: "",
};

const defaultMedicalHistory = {
  chronicConditions: [],
  allergies: [],
  surgeries: [],
};

const HealthDetails = () => {
  const { userData, setUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  
  // Use default values if userData doesn't have the required properties
  const vitalSigns = userData?.vitalSigns || defaultVitalSigns;
  const medicalHistory = userData?.medicalHistory || defaultMedicalHistory;
  const [medicalFormData, setMedicalFormData] = useState(medicalHistory);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      height: vitalSigns.height,
      weight: vitalSigns.weight,
      systolic: vitalSigns.bloodPressure.systolic,
      diastolic: vitalSigns.bloodPressure.diastolic,
      temperature: vitalSigns.temperature,
      pulseRate: vitalSigns.pulseRate,
      respiratoryRate: vitalSigns.respiratoryRate,
    },
  });

  const handleMedicalHistoryUpdate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/medical-history", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: userData.patientId,
          medicalHistory: medicalFormData
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setUserData({
          ...userData,
          medicalHistory: result.data
        });
        setIsEditingMedical(false);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating medical history:", error);
      alert("Failed to update medical history");
    } finally {
      setLoading(false);
    }
  };
  

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      alert(result.message);
      setUserData(result.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vital signs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Medical History Section remains unchanged
  const renderMedicalHistory = () => (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Medical History</h2>
        {!isEditingMedical ? (
          <button
            onClick={() => setIsEditingMedical(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Medical History
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditingMedical(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleMedicalHistoryUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700 mb-2">Chronic Conditions:</p>
          {isEditingMedical ? (
            <input
              type="text"
              value={medicalFormData.chronicConditions.join(", ")}
              onChange={(e) => setMedicalFormData({
                ...medicalFormData,
                chronicConditions: e.target.value.split(",").map(item => item.trim())
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter conditions separated by commas"
            />
          ) : (
            <p className="text-gray-600">
              {medicalHistory.chronicConditions.length > 0 
                ? medicalHistory.chronicConditions.join(", ")
                : "None reported"}
            </p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700 mb-2">Allergies:</p>
          {isEditingMedical ? (
            <input
              type="text"
              value={medicalFormData.allergies.join(", ")}
              onChange={(e) => setMedicalFormData({
                ...medicalFormData,
                allergies: e.target.value.split(",").map(item => item.trim())
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter allergies separated by commas"
            />
          ) : (
            <p className="text-gray-600">
              {medicalHistory.allergies.length > 0 
                ? medicalHistory.allergies.join(", ")
                : "None reported"}
            </p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700 mb-2">Past Surgeries:</p>
          {isEditingMedical ? (
            <input
              type="text"
              value={medicalFormData.surgeries.join(", ")}
              onChange={(e) => setMedicalFormData({
                ...medicalFormData,
                surgeries: e.target.value.split(",").map(item => item.trim())
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter surgeries separated by commas"
            />
          ) : (
            <p className="text-gray-600">
              {medicalHistory.surgeries.length > 0 
                ? medicalHistory.surgeries.join(", ")
                : "None reported"}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  // Updated Vital Signs Section with edit functionality
  const renderVitalSigns = () => (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Vital Signs</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Vital Signs
          </button>
        ) : (
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Height:</p>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              {...register("height")}
              className="w-full p-1 sm:p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600">{vitalSigns.height} cm</p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Weight:</p>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              {...register("weight")}
              className="w-full p-1 sm:p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600">{vitalSigns.weight} kg</p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Blood Pressure:</p>
          {isEditing ? (
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                {...register("systolic")}
                className="w-full p-1 sm:p-2 border rounded mt-1"
                placeholder="Systolic"
              />
              <span className="self-center">/</span>
              <input
                type="number"
                {...register("diastolic")}
                className="w-full p-1 sm:p-2 border rounded mt-1"
                placeholder="Diastolic"
              />
            </div>
          ) : (
            <p className="text-gray-600">
              {vitalSigns.bloodPressure.systolic}/
              {vitalSigns.bloodPressure.diastolic} mmHg
            </p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Temperature:</p>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              {...register("temperature")}
              className="w-full p-1 sm:p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600">{vitalSigns.temperature}°C</p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Pulse Rate:</p>
          {isEditing ? (
            <input
              type="number"
              {...register("pulseRate")}
              className="w-full p-1 sm:p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600">{vitalSigns.pulseRate} bpm</p>
          )}
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="font-medium text-gray-700">Respiratory Rate:</p>
          {isEditing ? (
            <input
              type="number"
              {...register("respiratoryRate")}
              className="w-full p-1 sm:p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600">
              {vitalSigns.respiratoryRate} breaths/min
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Health Details
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {renderMedicalHistory()}
        {renderVitalSigns()}
      </div>
    </div>
  );
};

export default HealthDetails;
