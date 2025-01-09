import Appointment from "@/model/Appointment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const a = cookieStore.get("token");
    const token = jwt.verify(a.value, process.env.JWT_SECRET);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }
    let appointments = await Appointment.find({
      $or: [{ patientId: token.id }, { doctorId: token.id }],
    })
    .sort({ date: -1 })
    .populate('patientId', 'name')
    .populate('doctorId', 'name email ');

    return NextResponse.json(
      {
        success: true,
        data: appointments,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in get-appointment route", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
