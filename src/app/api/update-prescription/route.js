import Prescription from "@/model/Prescription";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(request){
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const a = cookieStore.get("token");
        const token = jwt.verify(a.value, process.env.JWT_SECRET);

        if(!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                {
                    status: 401,
                }
            );
        }

        const { id, status } = await request.json();

        const prescription = await Prescription.findById(id);

        if(!prescription) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Prescription not found",
                },
                {
                    status: 404,
                }
            );
        }

        prescription.status = status;
        await prescription.save();

        return NextResponse.json(
            {
                success: true,
                message: "Prescription updated successfully",
                data: prescription,

            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Error in update-prescription route", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }

}