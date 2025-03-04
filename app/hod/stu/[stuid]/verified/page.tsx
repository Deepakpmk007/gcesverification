"use client";

import { useEffect, useState } from "react";

export default function VerifyStudentPage() {
  const [stuid, setStuid] = useState(""); // Student ID input
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Fetch student data when "Verify" button is clicked
  useEffect(() => {
    const fetchStudent = async () => {
      if (!stuid) {
        setError("Please enter a student ID.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://gcesverification.vercel.app/api/getData?id=${stuid}`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (data.success) {
          setStudent(data.data[0]);
        } else {
          throw new Error(data.message || "Student not found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch student data");
        } else {
          setError("Failed to fetch student data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }),
    [stuid];
  // Handle PDF upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdf(e.target.files?.[0] || null);
  };

  // Send email with the uploaded PDF
  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf) {
      setMessage("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("email", process.env.SMTP_SERVER_USERNAME || "");
    formData.append("sendTo", student.senderEmail || "");
    formData.append("subject", `Verification for ${student?.name}`);
    formData.append(
      "text",
      `Attached is the verification for ${student?.name}.`
    );
    formData.append("pdf", pdf);

    try {
      const res = await fetch(
        "https://gcesverification.vercel.app/api/pdfSend",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setMessage(data.success ? "Email sent successfully!" : data.error);
    } catch (error) {
      setMessage("Error sending email.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Upload & Send PDF</h2>

      <form onSubmit={sendEmail} className="mt-4 flex flex-col gap-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Email send to {student.senderEmail}
        </button>
      </form>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
