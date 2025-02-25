import StudentData, { IStudent } from "@/app/models/studentSchema";
import connectDB from "@/app/utils/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newData = await StudentData.create(body);
    return NextResponse.json(
      { success: true, message: "Data create Data", data: newData },
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

export async function GET() {
  try {
    await connectDB();
    const data = await StudentData.find();
    return NextResponse.json(
      { success: true, totalData: data.length, data: data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching posts", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, verifiedBy } = await req.json();
    const updatedData = await StudentData.findByIdAndUpdate(
      id,
      { verifiedBy, verified: true },
      { new: true }
    );

    if (!updatedData) {
      return NextResponse.json(
        { success: false, message: "Data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data updated successfully",
        data: updatedData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
