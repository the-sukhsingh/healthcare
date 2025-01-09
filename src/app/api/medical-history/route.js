import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import { NextResponse } from "next/server";



// PUT request handler to update medical history
export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { patientId, medicalHistory } = body;

        if (!patientId || !medicalHistory) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find and update the patient's medical history
        const updatedPatient = await Patient.findOneAndUpdate(
            { patientId: patientId },
            { 
                $set: { medicalHistory: medicalHistory },
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedPatient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Medical history updated successfully",
            data: updatedPatient.medicalHistory
        });

    } catch (error) {
        console.error("Error updating medical history:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}