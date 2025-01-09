"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDoctor } from "@/context/DoctorContext";
import { useAppointments } from "@/context/AppointmentContext";

const AppointmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appointmentForm = useForm({
    defaultValues: {
      doctorId: "",
      date: Date.now(),
      time: "",
      reason: "",
    },
  });

  const availabilityRef = useRef(null);

  const { doctors } = useDoctor();
  const { appointments, setAppointments } = useAppointments();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const uniqueDepartments = [
      ...new Set(doctors.map((doctor) => doctor.department)),
    ];
    setDepartments(uniqueDepartments);
  }, [doctors]);

const checkAvailabilityTime = (doctor, time) => {
  if (!doctor || !time || time.trim() === '') {
    if (availabilityRef.current) {
      availabilityRef.current.innerHTML = '';
    }
    return;
  }
  
  const availabilityHoursStart = doctor?.availability?.from || "9:00 AM";
  const availabilityHoursEnd = doctor?.availability?.to || "5:00 PM";

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
  };

  const [hours, minutes] = time.split(':');
  const selectedTime = new Date();
  selectedTime.setHours(parseInt(hours), parseInt(minutes), 0);

  const startTime = new Date();
  const [startHours, startMinutes] = convertTo24Hour(availabilityHoursStart).split(':');
  startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0); 

  const endTime = new Date();
  const [endHours, endMinutes] = convertTo24Hour(availabilityHoursEnd).split(':');
  endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

  if (selectedTime >= startTime && selectedTime <= endTime) {
    availabilityRef.current.innerHTML = `<p class="text-green-500 text-sm">Doctor is available at this time</p>`;
  } else {
    availabilityRef.current.innerHTML = `<p class="text-red-500 text-sm">Doctor is not available at this time</p>`;
  }
};

  

  const checkDayAvailability = (doctor, date) => {
    if (!doctor || !date) return;

    const availabilityDays = doctor?.availability?.days || [];
    const selectedDate = new Date(date);
    const selectedDay = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (availabilityDays.includes(selectedDay)) {
      availabilityRef.current.innerHTML = `<p class="text-green-500 text-sm">Doctor is available on this day</p>`;
    } else {
      availabilityRef.current.innerHTML = `<p class="text-red-500 text-sm">Doctor is not available on this day</p>`;
    }
  };

  const getFilteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case "today":
        return appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
      case "pending": {
        const pendingAppointments = appointments.filter(
          (appointment) => appointment.status === "pending"
        );
        const sortedAppointments = pendingAppointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        return sortedAppointments;
      }
      case "completed":
        return appointments.filter(
          (appointment) => appointment.status === "completed"
        );
      default:
        return appointments;
    }
  };

  const [filteredAppointments, setFilteredAppointments] = useState(
    getFilteredAppointments()
  );

  useEffect(() => {
    setFilteredAppointments(getFilteredAppointments());
  }, [appointments, activeTab]);

  const isWithinWorkingHours = (time) => {
    const [hours, minutes] = time.split(":");
    const selectedTime = new Date();
    selectedTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const startTime = new Date();
    const [startHours, startMinutes] = "09:00".split(":");
    startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endTime = new Date();
    const [endHours, endMinutes] = "15:00".split(":");
    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    return selectedTime >= startTime && selectedTime <= endTime;
  };

  const isWorkingDay = (date) => {
    const workingDays = selectedDoctor?.availability?.days || [];
    const selectedDate = new Date(date);
    const day = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    return workingDays.includes(day);
  };

  const handleSubmit = async (data) => {
    if (!isWorkingDay(data.date)) {
      alert("Please select a working day (Monday to Friday)");
      return;
    }

    if (!isWithinWorkingHours(data.time)) {
      alert("Please select a time between 09:00 and 15:00");
      return;
    }

    const res = await fetch("/api/add-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      setAppointments([...appointments, result.data]);
    }

    alert(result.message);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b-4 border-blue-500 pb-2">
          Appointments
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          + New Appointment
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            style={{
              scrollbarWidth: "none",
            }}
            className="bg-white p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Schedule New Appointment
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form
              className="space-y-6"
              onSubmit={appointmentForm.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    {...appointmentForm.register("department")}
                    onChange={(e) => {
                      const filtered = doctors.filter(
                        (doctor) => doctor.department === e.target.value
                      );
                      setFilteredDoctors(filtered);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Doctor
                  </label>
                  <select
                    {...appointmentForm.register("doctorId")}
                    onChange={(e) => {
                      const doctor = doctors.find(
                        (doc) => doc._id === e.target.value
                      );
                      setSelectedDoctor(doctor);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    {...appointmentForm.register("date")}
                    onChange={(e) => {
                      checkDayAvailability(selectedDoctor, e.target.value);
                    }}
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedDoctor?.availability?.days?.join(", ")} only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    {...appointmentForm.register("time")}
                    onChange={(e) =>
                      checkAvailabilityTime(selectedDoctor, e.target.value)
                    }
                    type="time"
                    min={selectedDoctor?.availability?.from || "09:00"}
                    max={selectedDoctor?.availability?.to || "15:00"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedDoctor?.availability?.from || "09:00"} to{" "}
                    {selectedDoctor?.availability?.to || "15:00"} only
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital
                </label>
                {selectedDoctor?.hospital ? (
                  <div className="mb-4 border border-gray-300 rounded-lg p-4">
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedDoctor.hospital[0].name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.hospital[0].location.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.hospital[0].location.city},{" "}
                      {selectedDoctor.hospital[0].location.state}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-red-500 text-sm">
                      Hospital details not found
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="w-full flex justify-between items-center">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Reason for Visit
                  </label>
                  <div ref={availabilityRef}></div>
                </div>
                <textarea
                  {...appointmentForm.register("reason")}
                  id="reason"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 bg-white"
                  placeholder="Please describe your symptoms or reason for visit"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Appointment History
        </h2>

        <div className="flex gap-4 mb-6">
          {["today", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center text-lg text-gray-500 col-span-3">
            No appointments found
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all duration-300"
            >
              <p className="font-semibold text-gray-800 text-lg mb-2">
                Doctor:{" "}
                {doctors.find((doc) => doc._id === appointment.doctorId)?.name}
              </p>
              <p className="text-gray-600">
                📅 {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">⏰ {appointment.time}</p>
              <p className="text-gray-600">🤔 {appointment.reason}</p>
              <p className="text-gray-600 mt-2">
                Status:
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
