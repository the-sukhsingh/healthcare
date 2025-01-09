import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import Prescription from "@/model/Prescription";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const cookieStore = await cookies();
  const a = cookieStore.get("token");
  const token = jwt.verify(a.value, process.env.JWT_SECRET);



  const {  symptoms, diagnosis, medicines } = await req.json();


  const prescription = new Prescription({
    patientId: token.id,
    symptoms,
    diagnosis,
    medicines,
  });

  const patient = await Patient.findById(token.id);

  patient.currentMedications.push(prescription._id);

  try {
    await prescription.save();
    await patient.save();

    return NextResponse.json(
      {
        success: true,
        message: "Prescription added successfully",
        data: prescription,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error adding prescription", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error adding prescription",
      },
      {
        status: 500,
      }
    );
  }
}
