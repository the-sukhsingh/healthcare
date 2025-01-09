import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    department: {
      type: String,
      required: [true, "Please provide a department"],
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Please provide a hospital ID"],
    },
    hospital:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    availability: {
      days: {
        type: [String],
        required: [true, "Please provide available days"],
      },
      from: {
        type: String,
        required: [true, "Please provide available from time"],
      },
      to: {
        type: String,
        required: [true, "Please provide available to time"],
      },
    },
    password: {
      type: String,
    },
    uid:{
      type: String,
    }
  },
  { timestamps: true }
);

DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

DoctorSchema.methods.generateToken = async function () {
  return jwt.sign({ id: this._id,email:this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

DoctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;