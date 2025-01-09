"use client";
import React, { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ToggleTheme";
import { useSearchParams, useRouter } from "next/navigation";

const AppointmentPage = React.lazy(() => import("@/components/Appointment"));
const UserData = React.lazy(() => import("@/components/UserData"));
const HealthDetails = React.lazy(() => import("@/components/HealthDetails"));
const Prescription = React.lazy(() => import("@/components/Prescription"));
const Records = React.lazy(() => import("@/components/Records"));
const buttons = [
  {
    name:"userData",
  },
  {
    name:"appointment",
  },
  {
    name:"healthDetails",
  },
  {
    name:"prescription",
  },{
    name:"records"
  }
]

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeComponent, setActiveComponent] = useState(
    searchParams.get("activeComponent") || "userData"
  );

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
    router.push(`/dashboard?activeComponent=${componentName}`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "appointment":
        return <AppointmentPage />;
      case "userData":
        return <UserData />;
      case "healthDetails":
        return <HealthDetails />;
      case "prescription":
        return <Prescription />;
      case "records":
        return <Records />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col sm:flex-row justify-between items-center dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow mb-6">
        <div
          onClick={() => router.push("/")}
          className="bg-green-500 text-white px-3 py-1 font-semibold sm:px-4 sm:py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
        >
          Go To Home
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Welcome, {userData?.name}
        </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
      </div>
      <div className="flex flex-col md:flex-row w-full min-h-screen items-start gap-4 sm:gap-6">
        <div className="flex md:flex-col w-full md:w-48 gap-2 sm:gap-4 h-full justify-start bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg shadow-md overflow-x-auto md:overflow-x-visible">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleComponentChange(button.name)}
              className={`px-6 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                activeComponent === button.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {button.name}
            </button>
          ))}
           <button
              onClick={() => router.push('/nearbyHospitals')}
              className={`px-6 py-2 rounded-lg capitalize font-medium transition-all duration-30 bg-white text-gray-700 hover:bg-gray-100`}
            >
              Nearby Hospitals
            </button>
        </div>
        <div className="w-full h-full">

          <Suspense fallback={<div>Loading...</div>}>
            {renderComponent()}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default React.memo(Dashboard);
