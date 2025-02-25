"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appWriterStorage } from "@/app/utils/appWriter";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

export default function StudentPage() {
  const { id } = useParams(); // Get student ID from URL
  const router = useRouter(); // Router for navigation
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [selections, setSelections] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    console.log("URL Parameter ID:", id); // Debugging: Check if id is correct

    if (!id) {
      setError("No student ID found in URL");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/getData?id=${id}`);
        const data = await res.json();

        // console.log("Fetched Data:", data.data[0]); // Debugging: Check API response

        if (data.success) {
          setStudent(data.data[0]);
        } else {
          setError(data.message || "Student not found");
        }
      } catch (err) {
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);
  // console.log(student);

  const updataData = async (id: string, verifiedBy: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, verifiedBy }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Data updated successfully!");
      } else {
        console.log(`Error: ${data.message || "Failed to update data"}`);
      }
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndSendPDF = async () => {
    if (pdfRef.current) {
      const canvas = await html2canvas(pdfRef.current);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          const email = process.env.SMTP_SERVER_USERNAME;
          if (email) {
            formData.append("email", email);
          } else {
            console.error("SMTP_SERVER_USERNAME is not defined");
          }
          formData.append("sendTo", student.email);
          formData.append("subject", "Verified user data");
          formData.append("text", `verified by ${student.verifiedBy}`);
          formData.append("pdf", blob, "student_details.pdf");

          try {
            const response = await fetch("/api/pdfSend", {
              method: "POST",
              body: formData,
            });
            updataData(student._id, "deepak");
            if (response.ok) {
              console.log("Email sent successfully!");
            } else {
              console.error("Failed to send email.");
            }
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      });
    }
    if (loading) return <p>Loading student data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!student) return <p>No student found</p>;

    return (
      <div className="p-6">
        <button
          onClick={() => router.back()} // Go back to the previous page
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4">Student Details</h1>
        <div className="border p-4 rounded shadow-lg bg-white">
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border">Field</th>
                <th className="p-3 border">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  id
                </td>
                <td className="p-3 border">{student._id}</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  remark
                </td>
                <td className="p-3 border">{student.remark}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  verified
                </td>
                <td className="p-3 border">
                  {student.verified ? `✅ verified` : `❌ not-verified`}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  verifiedBy
                </td>
                <td className="p-3 border">{student.verifiedBy}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  agencyName
                </td>
                <td className="p-3 border">{student.agencyName}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  senderEmail
                </td>
                <td className="p-3 border">{student.senderEmail}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  contact
                </td>
                <td className="p-3 border">{student.contact}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border font-semibold bg-gray-100 capitalize">
                  File Download Link
                </td>
                <td className="flex gap-4">
                  {student.fileIds?.map((fileId: string, i: number) => (
                    <a
                      key={fileId}
                      href={appWriterStorage.getFileDownload(
                        "676d799200277b1b2951",
                        `${fileId}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {i}-File-{fileId}
                    </a>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
          <div ref={pdfRef}>
            <table className="w-full border-collapse border border-gray-300 shadow-md mt-5">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 border">Field</th>
                  <th className="p-3 border">Value</th>
                  <th className="p-3 border">Yes/No</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(student).map(([field, value]) => (
                  <tr key={field} className="border-b">
                    <td className="p-3 border font-semibold bg-gray-100 capitalize">
                      {field}
                    </td>
                    <td className="p-3 border">{value}</td>
                    <td>
                      <select
                        className="border ml-2"
                        value={selections[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <button className="bg-green-400 px-4 py-2 rounded-lg hover:bg-green-500 transition">
              Verified
            </button>
          </div>
        </div>
      </div>
    );
  };
}
