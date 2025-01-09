import mongoose, { Schema } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please provide a patient ID"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    symptoms: {
      type: String,
      required: [true, "Please provide symptoms"],
    },
    diagnosis: {
      type: String,
      required: [true, "Please provide a diagnosis"],
    },
    medicines: [
      {
        name: String,
        dosage: String,
        duration: String,
        notes: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);

export default Prescription;
