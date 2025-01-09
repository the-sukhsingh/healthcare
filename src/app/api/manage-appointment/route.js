import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import Appointment from "@/model/Appointment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  await dbConnect();

  const { appointmentId, status } = await req.json();

  const validStatus = ["pending", "completed", "cancelled"];
  if (!validStatus.includes(status)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid status",
      },
      {
        status: 400,
      }
    );
  }

  const cookieStore = await cookies();
  const a = cookieStore.get("token");
  const token = jwt.verify(a.value, process.env.JWT_SECRET);

  const patient = await Patient.findOne({ _id: token.id });
  if (!patient) {
    return NextResponse.forbidden({
      success: false,
      message: "Patient not found",
    });
  }
  
  const appointment = await Appointment.findOne({ _id: appointmentId });
  if (!appointment) {
    return NextResponse.json(
      {
        success: false,
        message: "Appointment not found",
      },
      {
        status: 404,
      }
    );
  }

  appointment.status = status;

  try {
    await appointment.save();
    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
        data: appointment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error updating appointment", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error updating appointment",
      },
      {
        status: 500,
      }
    );
  }
}
