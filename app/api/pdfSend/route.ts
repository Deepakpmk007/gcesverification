import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "30mb", // Increase to 30MB (or adjust as needed)
    }, // Disable default bodyParser
  },
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    console.log([...formData.entries()]); // Debug: Log form data

    // const email = formData.get("email") as string;
    const sendTo = formData.get("sendTo") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const pdfFile = formData.get("pdf") as File;

    console.log("📂 Received file:", pdfFile.name);

    const buffer = await pdfFile.arrayBuffer();
    const attachment = Buffer.from(buffer);

    const mailOptions = {
      from: process.env.SMTP_SERVER_USERNAME,
      to: sendTo,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: pdfFile.name || "document.pdf",
          content: attachment,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    return NextResponse.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: "Email sending failed" },
      { status: 500 }
    );
  }
}
