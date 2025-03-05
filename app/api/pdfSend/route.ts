import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME as string,
    pass: process.env.SMTP_SERVER_PASSWORD as string,
  },
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const pdfFile = formData.get("pdf") as File;

    if (!email || !subject || !text || !pdfFile) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    const mailOptions = {
      from: process.env.SMTP_SERVER_USERNAME,
      to: email,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: pdfFile.name,
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

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
