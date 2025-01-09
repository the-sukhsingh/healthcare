import { NextResponse } from "next/server";
import Patient from "@/model/Patient";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const firebaseUid = searchParams.get('firebaseUid');

        if (!firebaseUid) {
            return NextResponse.json(
                { success: false, message: "Firebase UID is required" }, 
                { status: 400 }
            );
        }

        const patient = await Patient.findOne({ firebaseUid });
        
        return NextResponse.json({
            success: true,
            exists: !!patient,
            patient: patient ? { 
                id: patient._id,
                name: patient.name,
                email: patient.contact?.email,
                patientId: patient.patientId
            } : null
        });
    } catch (error) {
        console.error("Check patient error:", error);
        return NextResponse.json(
            { success: false, message: error.message }, 
            { status: 500 }
        );
    }
}
