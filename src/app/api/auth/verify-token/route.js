import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Patient from "@/model/Patient";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token || !token.value) {
      return NextResponse.json({
        success: false,
        message: "No token found",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Invalid token format",
      });
    }

    const patient = await Patient.findOne({ "contact.email": decoded.email });

    if (!patient) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
   
    return NextResponse.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
      data: patient,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({
      success: false,
      message: "Invalid token",
    });
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    const { newToken } = await request.json();

    if (newToken) {
      // Verify the new token before setting
      jwt.verify(newToken, process.env.JWT_SECRET);

      // Set the new token
      cookies().set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No token found",
      });
    }

    // Verify existing token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({
      success: false,
      message: "Invalid token",
    });
  }
}
