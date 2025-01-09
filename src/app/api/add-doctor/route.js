import dbConnect from "@/lib/dbConnect";
import Doctor from "@/model/Doctor";
import Hospital from "@/model/Hospital";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { name, email, phone, department, availability, password,identifier } = await req.json();

  const hospital = await Hospital.findOne(
{ identifier }
  );
  const doctor = await Doctor.create({
    name,
    email,
    phone,
    department,
    hospitalId: hospital._id,
    availability,
    password,
  });
  hospital.doctors.push(doctor._id);

  try {
    await doctor.save();
    await hospital.save();
    return NextResponse.json(
      {
        success: true,
        message: "Doctor added successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
