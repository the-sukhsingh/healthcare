"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Records = () => {
  const [records, setRecords] = useState([]);

  const { userData } = useAuth();

  const [addModel, setAddModel] = useState({
    show: false,
    image: null,
  });
  const [addingPhoto, setAddingPhoto] = useState(false);

  useEffect(() => {
    if (userData) {
      setRecords(userData.records || []);
    }
  }, [userData]);


  const [showImage, setShowImage] = useState({
    show: false,
    image: null,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return false;
    }
    setError(null);
    return true;
  };

  const sendRecord = async (file) => {
    if (!validateFile(file)) return false;
    
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/add-record", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setRecords([
        ...records,
        {
          imageUrl: data.data.imageUrl,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      return data.success;
    }
  };

  const deleteRecord = async (imageUrl) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    const response = await fetch("/api/delete-record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (data.success) {
      setRecords(records.filter((record) => record.imageUrl !== imageUrl));
    }

    alert(data.message);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b-4 border-blue-500 pb-2">
          Records
        </h1>
        <button
          onClick={() => setAddModel({ show: true })}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          + New Record
        </button>
      </div>

      {addModel && addModel.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex  items-center justify-center z-50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Record
              </h2>
              <button
                onClick={() => setAddModel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = [...e.dataTransfer.files];
                if (validateFile(files[0])) {
                  setFile(files[0]);
                  setAddModel({ show: true, image: files[0] });
                }
              }}
              onClick={() => document.querySelector("#fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={(e) => {
                  const files = [...e.target.files];
                  if (validateFile(files[0])) {
                    setFile(files[0]);
                    setAddModel({ show: true, image: files[0] });
                  }
                }}
                accept="image/*"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {error && (
                <p className="text-red-500 mt-2">{error}</p>
              )}
              {addModel.image ? (
                <img
                  src={URL.createObjectURL(addModel.image)}
                  alt="Record"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <p className="text-gray-600">
                  Drag and drop an image here, or click to select
                </p>
              )}
            </div>

            <button
              onClick={async () => {
                setAddingPhoto(true);
                const success = await sendRecord(file);
                if (success) {
                  setAddModel({ show: false, image: null });
                }
                setAddingPhoto(false);
              }}
              disabled={addingPhoto}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50"
            >
              {addingPhoto ? "Uploading..." : "Upload Record"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {records.length > 0 && records.map((record, index) => (
          <div
            key={index}
            onClick={() => setShowImage({ show: true, image: record })}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={record.imageUrl}
              alt={`Record ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <h3 className="mt-2 text-lg font-semibold text-gray-800">
              Record {index + 1}
            </h3>
          </div>
        ))}
        {
          records.length === 0 && (
            <p className="text-gray-600 text-center col-span-3">
              No records found. Click the button above to add a new record.
            </p>
          )
        }
      </div>
      {showImage && showImage.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="w-full flex justify-between items-center mb-6">
              <button
                onClick={() => setShowImage({ show: false, image: null })}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

              <button
                onClick={() => {
                  deleteRecord(showImage.image.imageUrl);
                  setShowImage({ show: false, image: null });
                }}
                className="text-red-500 hover:text-red-700 text-2xl"
              >
                Delete
              </button>
            </div>
            <img
              src={showImage.image.imageUrl}
              alt="Record"
              className="w-full h-96 object-cover rounded-lg shadow-lg mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
