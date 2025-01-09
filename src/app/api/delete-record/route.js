import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Patient from "@/model/Patient";
import dbConnect from "@/lib/dbConnect";
import { deleteFromBlob } from "@/app/azure/storage-blob";

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: "No authentication token" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        const patientId = decoded.id;

        // Connect to database
        await dbConnect();
        
        // Find patient and remove record
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json(
                { success: false, message: "Patient not found" },
                { status: 404 }
            );
        }

        // Find and remove the record from patient's records array
        const recordIndex = patient.records.findIndex(record => record.imageUrl === imageUrl);
        if (recordIndex === -1) {
            return NextResponse.json(
                { success: false, message: "Record not found" },
                { status: 404 }
            );
        }

        // Delete from Azure Blob storage
        const deleteResult = await deleteFromBlob(
            imageUrl.split('/').pop()
        );
        if (!deleteResult.success) {
            return NextResponse.json(
                { success: false, message: "Failed to delete image from storage",error: deleteResult },
                { status: 500 }
            );
        }

        // Remove record from patient's records array
        patient.records.splice(recordIndex, 1);
        await patient.save();

        return NextResponse.json(
            { success: true, message: "Record deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting record:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Failed to delete record",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
