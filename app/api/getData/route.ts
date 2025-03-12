import StudentData from "@/app/models/studentSchema";
import connectDB from "@/app/utils/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const idsParam = searchParams.getAll("id");

    if (!idsParam || idsParam.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    const data = await StudentData.find({ _id: { $in: idsParam } });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching students:", error.message);
    return NextResponse.json(
      { message: "Error fetching students", error: error.message },
      { status: 500 }
    );
  }
}
