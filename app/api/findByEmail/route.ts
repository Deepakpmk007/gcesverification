import Users from "@/app/models/usersSchema";
import connectDB from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    await connectDB();
    const user = await Users.findOne({ email }).select("_id");
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching the user." },
      { status: 500 }
    );
  }
}
