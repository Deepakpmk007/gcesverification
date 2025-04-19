import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/app/utils/db";
import TotalStudent from "@/app/models/TotalStudent";

// Create new student
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Support array or single object
    const records = Array.isArray(body) ? body : [body];
    const newData = await TotalStudent.insertMany(records, { ordered: false });

    return NextResponse.json(
      { success: true, message: "Students uploaded", data: newData },
      { status: 201 }
    );
  } catch (error: any) {
    let errorMessage = error.message;

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      errorMessage = `${field} must be unique. The value already exists.`;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Fetch all students
export async function GET() {
  try {
    await connectDB();
    const data = await TotalStudent.find();

    return NextResponse.json(
      { success: true, totalData: data.length, data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
