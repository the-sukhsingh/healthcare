import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const cookieStore = await cookies();
  const a = cookieStore.get("token");
  const token = jwt.verify(a.value, process.env.JWT_SECRET);

  const {
    height,
    weight,
    systolic,
    diastolic,
    temperature,
    pulseRate,
    respiratoryRate,
  } = await req.json();

  const patient = await Patient.findOne({ _id: token.id });

  if (!patient) {
    return NextResponse.json(
      {
        success: false,
        message: "Patient not found",
      },
      { status: 400 }
    );
  }

  const vitalSigns = {
    height,
    weight,
    bloodPressure:{
      systolic,
      diastolic
    },
    temperature,
    pulseRate,
    respiratoryRate,
  };

  patient.vitalSigns = vitalSigns;

  try {
    await patient.save();
    return NextResponse.json(
      {
        success: true,
        message: "Vital signs saved successfully",
        data: patient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving vital signs", error);
    return NextResponse.json(
      {
        success: false,
        errors: error.errors,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
