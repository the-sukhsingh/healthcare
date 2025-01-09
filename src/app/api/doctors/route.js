import Doctor from "@/model/Doctor";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const doctors = await Doctor.aggregate([
    {
      $lookup: {
        from: "appointments",
        localField: "_id",
        foreignField: "doctorId",
        as: "appointments",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        department: 1,
        availability: 1,
        hospital: 1,
        hospitalId: 1,
        appointments: {
          $filter: {
            input: "$appointments",
            as: "appointment",
            cond: {
              $eq: ["$$appointment.status", "pending"],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "hospitalId",
        foreignField: "_id",
        as: "hospital"
      }
    }
    
  ]);



  if(!doctors){
    return NextResponse.json(
      {
        success: false,
        message: "No doctors found",
        data :[],
      },
      {
        status: 404,
      }
    );
  }

  const doctorWithHospitals = doctors.map((doctor) => {
      return {
        doctor
      }
  });

  console.dir(doctors);

  return NextResponse.json(
    {
      success: true,
      message: "All doctors",
      data: doctors,
    },
    {
      status: 200,
    }
  );
}
