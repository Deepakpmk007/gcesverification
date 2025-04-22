"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyStudentPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const { stuid } = useParams();

  useEffect(() => {
    if (!stuid) return;

    const fetchStudent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/getData?id=${stuid}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setStudent(data.data[0]);
        } else {
          setError("Student not found");
          setStudent(null);
          toast.error("Student not found!");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch student data"
        );
        toast.error("Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [stuid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdf(file);
    if (file) {
      toast.success(`✅ File selected: ${file.name}`, {
        duration: 3000,
        icon: "📄",
      });
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf) {
      toast.error("⚠️ Please upload a PDF file.");
      return;
    }
    if (!student || !student.senderEmail) {
      toast.error("⚠️ No valid student email found.");
      return;
    }

    const formData = new FormData();
    formData.append("email", student.senderEmail);
    formData.append("subject", `Verification for ${student.name}`);
    formData.append(
      "text",
      `Attached is the verification document for ${student.name}.`
    );
    formData.append("pdf", pdf);

    const toastId = toast.loading("📨 Sending email...");
    try {
      const res = await fetch("http://localhost:3000  /api/pdfSend", {
        method: "POST",
        body: formData,
      });

      const rawText = await res.text();

      const data = JSON.parse(rawText);
      if (data.success) {
        toast.success("✅ Email sent successfully!", {
          id: toastId,
          icon: "🎉",
        });
      } else {
        toast.error(data.error || "❌ Error sending email.", { id: toastId });
      }
    } catch (error) {
      toast.error("❌ Error sending email.", { id: toastId });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "16px",
          },
        }}
      />

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
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            onClick={sendEmail}
          >
            Send Email to {student.senderEmail}
          </button>
        </form>
      )}
    </div>
  );
}
