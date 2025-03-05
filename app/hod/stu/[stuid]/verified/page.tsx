"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyStudentPage() {
  // Student ID input
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const { stuid } = useParams();

  // Fetch student data when Student ID changes
  useEffect(() => {
    if (!stuid) return; // Prevent unnecessary API calls

    const fetchStudent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://gcesverification.vercel.app/api/getData?id=${stuid}`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setStudent(data.data[0]);
        } else {
          setError("Student not found");
          setStudent(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch student data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [stuid]);

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
    if (!student || !student.senderEmail) {
      setMessage("No valid student email found.");
      return;
    }

    const formData = new FormData();
    // formData.append("email", process.env.SMTP_SERVER_USERNAME || "");
    formData.append("sendTo", student.senderEmail);
    formData.append("subject", `Verification for ${student.name}`);
    formData.append(
      "text",
      `Attached is the verification document for ${student.name}.`
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
      setMessage(
        data.success
          ? "Email sent successfully!"
          : data.error || "Error sending email."
      );
    } catch (error) {
      setMessage("Error sending email.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Student Verification</h2>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {student && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold">Student Details</h3>
          <p>Name: {student.name}</p>
          <p>Email: {student.senderEmail}</p>
        </div>
      )}
      {student && (
        <form className="mt-4 flex flex-col gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={sendEmail}
          >
            Send Email to {student.senderEmail}
          </button>
        </form>
      )}

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
