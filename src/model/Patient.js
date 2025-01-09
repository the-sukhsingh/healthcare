import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PatientSchema = new Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  patientId: {
    type: String,
    required: [true, "Please provide a patient ID"],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please provide a date of birth"],
  },
  gender: {
    type: String,
    required: [true, "Please provide gender"],
  },
  age: {
    type: Number,
  },
  adhaar: {
    type: String,
    required: [true, "Please provide adhaar number"],
    unique: true,
  },
  contact: {
    address: {
      type: String,
      required: [true, "Please provide address"],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
    },
  },
  medicalHistory: {
    chronicConditions: [String],
    allergies: [String],
    surgeries: [
String
    ],
  },
  currentMedications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
  records: [
    {
      imageUrl: String,
      uploadedAt: Date,
    },
  ],
  vitalSigns: {
    height: Number,
    weight: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    temperature: Number,
    pulseRate: Number,
    respiratoryRate: Number,
  },
  paymentHistory: [
    {
      date: Date,
      amount: Number,
      paymentMethod: String,
      transactionId: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PatientSchema.pre("save", async function (next) {
  this.age =
    new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

PatientSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    const patient = await this.constructor
      .findById(this._id)
      .select("+password");
    return await bcrypt.compare(password, patient.password);
  }
  return await bcrypt.compare(password, this.password);
};

PatientSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.contact.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export default Patient;
