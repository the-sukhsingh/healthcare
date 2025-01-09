import Prescription from "@/model/Prescription";
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

    if(!token) {
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

    const prescriptions = await Prescription.find({
      $or: [{ patientId: token.id }, { doctorId: token.id }],
    })

    return NextResponse.json(
      {
        success: true,
        data: prescriptions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in get-prescription route", error);
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
