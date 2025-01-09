import dbConnect from "@/lib/dbConnect";
import Hospital from "@/model/Hospital";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { name, location, contact, services, bedAvailability,password } =
    await req.json();

  try {
    const hospital = await Hospital.create({
      name,
      location,
      contact,
      services,
      bedAvailability,
      password,
    });
    
    await hospital.save();

    return NextResponse.json(
      {
        success: true,
        message: "Hospital created successfully",
        data: hospital,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error creating hospital", error);
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