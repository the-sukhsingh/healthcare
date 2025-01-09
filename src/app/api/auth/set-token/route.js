import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import Patient from "@/model/Patient";
import dbConnect from "@/lib/dbConnect";


export async function POST(request) {

    await dbConnect();
    const cookieStore =  await cookies();

    try {
        const { email } = await request.json();
        const patient = await Patient.findOne({"contact.email": email});


        if(patient){
            const token = await patient.generateToken();
    
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
    
    
            return NextResponse.json({ success: true, data: patient });
        }

        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });


    } catch (error) {
        console.error('Token setting error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
