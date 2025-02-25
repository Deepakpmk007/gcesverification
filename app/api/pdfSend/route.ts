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
    const sendTo = formData.get("sendTo") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const pdfFile = formData.get("pdf") as File;

    // if (!pdfFile) {
    //   return NextResponse.json(
    //     { success: false, error: "No PDF file uploaded." },
    //     { status: 400 }
    //   );
    // }

    const buffer = await pdfFile.arrayBuffer();
    const attachment = Buffer.from(buffer);

    const mailOptions = {
      from: email,
      to: sendTo || (process.env.SITE_MAIL_RECIEVER as string),
      subject: subject,
      text: text,
      attachments: [
        {
          filename: "student_details.pdf",
          content: attachment,
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
