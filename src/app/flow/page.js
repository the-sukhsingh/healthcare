"use client"
import React from 'react'
import { FaUser, FaHospital, FaUserMd, FaSignInAlt, FaUserPlus, FaCalendarAlt } from 'react-icons/fa'
import { MdHealthAndSafety, MdLogout, MdManageAccounts } from 'react-icons/md'
import { RiMedicineBottleFill, RiHospitalFill } from 'react-icons/ri'
import { BsFillPersonPlusFill } from 'react-icons/bs'

const ApplicationFlow = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-12 flex items-center justify-center gap-3">
          <MdHealthAndSafety className="text-indigo-600 text-5xl" />
          Application Flow
        </h1>
        
        {/* User Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaUser className="text-blue-500" />
            1. For User
          </h2>
          <div className="pl-6 space-y-6">
            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaUserPlus className="text-green-500" />
                (a) User Registration
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>With Email and Password</li>
                <li>With Google</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaSignInAlt className="text-green-500" />
                (b) User Login
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>With Email and Password</li>
                <li>With Google</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MdManageAccounts className="text-green-500" />
                (c) User Profile
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>View Profile</li>
                <li>Edit Profile (User Data and Health Data)</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                (d) Appointment Management
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>View Appointments</li>
                <li>Book Appointment</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <RiMedicineBottleFill className="text-green-500" />
                (e) Prescription Management
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>Add Prescription</li>
                <li>View Prescriptions</li>
                <li>Complete Prescription</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MdHealthAndSafety className="text-green-500" />
                (f) Health Record Management
              </h3>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>View Health Records</li>
                <li>Add Health Records</li>
                <li>Delete Health Records</li>
              </ul>
            </div>

            <div className="flow-item">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MdLogout className="text-green-500" />
                (g) Logout
              </h3>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flow-item {
          transition: transform 0.2s;
        }
        .flow-item:hover {
          transform: translateX(10px);
        }
      `}</style>
    </div>
  )
}

export default ApplicationFlow