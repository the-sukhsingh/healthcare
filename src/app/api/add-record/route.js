import {  uploadToBlob } from "@/app/azure/storage-blob";
import { NextResponse } from "next/server";
import Patient from "@/model/Patient";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const cookieStore = await cookies();
    const a = cookieStore.get("token");
    
    if (!a) {
      return NextResponse.json(
        { success: false, message: "No authentication token" },
        { status: 401 }
      );
    }

    const token = jwt.verify(a.value, process.env.JWT_SECRET);
    const patientId = token.id;

    if (!file || !patientId) {
      return NextResponse.json(
        { success: false, message: "Please provide an image and patientId" },
        { status: 400 }
      );
    }

    // Upload file using the utility function
    const uploadResult = await uploadToBlob(file);
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Connect to MongoDB and update patient record
    await dbConnect();
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Add image URL to patient's records array
    patient.records.push({ 
      imageUrl: uploadResult.imageUrl, 
      fileName: uploadResult.fileName,
      uploadedAt: new Date() 
    });
    await patient.save();

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl: uploadResult.imageUrl,
          fileName: uploadResult.fileName
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "An error occurred",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
