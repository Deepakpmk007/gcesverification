import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME as string,
    pass: process.env.SMTP_SERVER_PASSWORD as string,
  },
});

interface EmailRequest {
  email: string;
  // sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, subject, text, html }: EmailRequest = await req.json();

    const recipient = process.env.SMTP_SERVER_USERNAME as string;
    if (!recipient) {
      return NextResponse.json(
        { success: false, error: "No recipient email provided." },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: email,
      to: recipient,
      subject: subject,
      text: text,
      html: html || "",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.messageId);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: "Email sending failed" },
      { status: 500 }
    );
  }
}
