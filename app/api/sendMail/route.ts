import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME as string,
    pass: process.env.SMTP_SERVER_PASSWORD as string,
  },
});

interface EmailRequest {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, sendTo, subject, text, html }: EmailRequest =
      await req.json();

    // if (!email || !subject || !text) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Missing required fields (email, subject, text)",
    //     },
    //     { status: 400 }
    //   );
    // }

    const recipient = sendTo || (process.env.SITE_MAIL_RECIEVER as string);
    if (!recipient) {
      return NextResponse.json(
        { success: false, error: "No recipient email provided." },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: email,
      to: recipient, // Ensuring the recipient is always defined
      subject: subject,
      text: text,
      html: html || "", // Default to empty string if no HTML provided
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
