import Patient from "@/model/Patient";
import Appointment from "@/model/Appointment";
import Doctor from "@/model/Doctor";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { doctorId, date, time, reason } = await req.json();

  const cookieStore = await cookies();
  const a = cookieStore.get("token");
  const token = jwt.verify(a.value, process.env.JWT_SECRET);

  const patient = await Patient.findOne({ "contact.email": token.email });
  const doctor = await Doctor.findOne({ _id: doctorId });


  if (!patient || !doctor) {
    return NextResponse.json(
      {
        success: false,
        message: "Patient or doctor not found",
      },
      {
        status: 404,
      }
    );
  }

  const appointment = new Appointment({
    patientId: patient._id,
    doctorId,
    date,
    time,
    reason,
  });

  patient.appointments.push(appointment._id);
  doctor.appointments.push(appointment._id);

  try {
    await appointment.save();
    await patient.save();
    await doctor.save();

    return NextResponse.json(
      {
        success: true,
        message: "Appointment added successfully",
        data: appointment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error adding appointment", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error adding appointment",
      },
      {
        status: 500,
      }
    );
  }
}
