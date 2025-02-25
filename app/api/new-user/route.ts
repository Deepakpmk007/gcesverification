import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/utils/db";
import Users from "@/app/models/usersSchema";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectDB();
    await Users.create({ name, email, password: hashedPassword, role });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await Users.find();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching users." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, studentId } = await req.json();
    if (!userId || !studentId) {
      return NextResponse.json(
        { message: "Both userId and studentId are required." },
        { status: 400 }
      );
    }
    await connectDB();
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $addToSet: { studentData: studentId } },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Student ID added to user.", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the user." },
      { status: 500 }
    );
  }
}
