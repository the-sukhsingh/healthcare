import { NextResponse } from "next/server";
import Patient from "@/model/Patient";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'dateOfBirth', 'gender', 'adhaar', 'contact.address', 'contact.phone'];
    for (const field of requiredFields) {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], data)
        : data[field];
      
      if (!value) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    const patientId = `P${Date.now()}`;
    
    const patient = await Patient.create({
      ...data,
      patientId,
    });

    return NextResponse.json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}