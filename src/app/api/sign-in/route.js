import dbConnect from "@/lib/dbConnect";
import Patient from "@/model/Patient";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { identifier, password } = await req.json();
    try {

            const patient = await Patient.findOne({
                $or: [
                    {
                        patientId: identifier
                    },
                    {
                        "contact.email": identifier
                    }
                ]
            });

            if (!patient) {
                return NextResponse.json({
                    success: false,
                    message: "Patient not found"
                }, {
                    status: 404
                });
            }
            
            const isMatch = await patient.comparePassword(password);
            
            if (!isMatch) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid credentials"
                }, {
                    status: 401
                });
            }
            
            const token = await patient.generateToken();
            
            const response = NextResponse.json({
                success: true,
                message: "Patient logged in successfully",
                data: patient,
            }, {
                status: 200
            });
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: 'strict',
            });
            
            return response;
        

    }catch(error){
        console.log("Error logging in patient", error);
        return NextResponse.json({
            success: false,
            message: "Error logging in patient"
        }, {
            status: 500
        });
    }
}
