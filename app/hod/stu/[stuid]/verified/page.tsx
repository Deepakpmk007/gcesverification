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
    formData.append("email", email);
    formData.append("sendTo", student?.email || "");
    formData.append("subject", `Verification for ${student?.name}`);
    formData.append(
      "text",
      `Attached is the verification for ${student?.name}.`
    );
    formData.append("pdf", pdf);

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.success ? "Email sent successfully!" : data.error);
    } catch (error) {
      setMessage("Error sending email.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Student Verification</h2>

      {/* Student ID Input */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={stuid}
          onChange={(e) => setStuid(e.target.value)}
          className="border p-2"
        />
        <button onClick={fetchStudent} className="bg-blue-500 text-white p-2">
          Verify
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Student Details */}
      {student && (
        <div className="mt-4 p-4 border">
          <h3 className="text-lg font-bold">Student Details</h3>
          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Verified: {student.verified ? "Yes" : "No"}</p>

          {/* PDF Upload and Send Email */}
          <form onSubmit={sendEmail} className="mt-4 flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="border p-2"
            />
            <button type="submit" className="bg-green-500 text-white p-2">
              Send Email
            </button>
          </form>
        </div>
      )}

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
