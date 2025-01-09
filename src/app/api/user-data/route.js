import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  await dbConnect();

  const cookieStore = await cookies();
  const a = cookieStore.get("token");
  const token = jwt.verify(a.value, process.env.JWT_SECRET);

  const {
    address,
    adhaar,
    age,
    dateOfBirth,
    email,
    gender,
    patientId,
    phone,
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

  if(patient.patientId !== patientId) {
    return NextResponse.json(
      {
        success: false,
        message: "Patient ID does not match",
      },
      { status: 400 }
    );
  }

  patient.contact = {
    address,
    email,
    phone,
  }

  patient.adhaar = adhaar;
    patient.dateOfBirth = dateOfBirth
    patient.gender = gender;
    patient.age = age;


  try {
    await patient.save();
    return NextResponse.json(
      {
        success: true,
        message: "Patient data updated",
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
