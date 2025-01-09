import React, { useState } from 'react';

const PrescriptionModal = ({  onClose }) => {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', duration: '', notes: '' },
  ]);

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', notes: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symptoms || !diagnosis || medicines.some(med => !med.name || !med.dosage || !med.duration)) {
      alert('All fields are required.');
      return;
    }

    const prescriptionData = {
      symptoms,
      diagnosis,
      medicines,
    };

    try {
      const res = await fetch('/api/add-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Prescription added successfully.');
        onSave(data.data);
      } else {
        alert(data.message || 'Failed to add prescription.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the prescription.');
    }
  };

  return (
    <div className="fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ maxHeight: '100vh' }}>
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
          <h2 className="text-2xl font-bold text-gray-800">Add Prescription</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Diagnosis</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Medicines</label>
            {medicines.map((medicine, index) => (
              <div key={index} className="mb-3 border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-700">Medicine {index + 1}</h4>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    placeholder="Medicine Name"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    placeholder="Dosage (e.g., 2 times a day)"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={medicine.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    placeholder="Duration (e.g., 7 days)"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={medicine.notes}
                    onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                    placeholder="Additional Notes"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicine}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
            >
              + Add Another Medicine
            </button>
          </div>
          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;