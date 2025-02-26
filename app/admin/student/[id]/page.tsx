"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appWriterStorage } from "@/app/utils/appWriter";
import toast from "react-hot-toast";

export default function StudentPage() {
  const { id } = useParams(); // Get student ID from URL
  const router = useRouter(); // Router for navigation
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    console.log("URL Parameter ID:", id); // Debugging: Check if id is correct

    if (!id) {
      setError("No student ID found in URL");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `https://gcesverification.vercel.app/api/getData?id=${id}`
        );
        const data = await res.json();

        console.log("Fetched Data:", data); // Debugging: Check API response

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

  const updateUserStudentData = async (userId: string, studentId: string) => {
    try {
      const response = await fetch(
        "https://gcesverification.vercel.app/api/new-user",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, studentId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user data.");
      }
      console.log("Update Successful:", data);
      toast.success("Student ID added to user data successfully!");
    } catch (error: any) {
      console.error("Error updating user data:", error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const sendEmail = async () => {
    setIsSending(true);
    try {
      const userResponse = await fetch(
        `https://gcesverification.vercel.app/api/findByEmail?email=${email}`
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(`User Fetch Error: ${errorData.message}`);
      }

      const userData = await userResponse.json();
      const userId = userData.data._id;

      console.log("Fetched User ID:", userId);
      updateUserStudentData(userId, student._id);

      const emailResponse = await fetch(
        "https://gcesverification.vercel.app/api/sendMail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: process.env.SMTP_SERVER_USERNAME,
            sendTo: email,
            subject: "Verification of Student Details",
            text: `${student.remark}`,
            html: `<h1>Student Details</h1><p><strong>Name:</strong> ${student.name}</p>`,
          }),
        }
      );

      if (!emailResponse.ok) {
        throw new Error(
          `Email Error: ${emailResponse.status} - ${await emailResponse.text()}`
        );
      }

      toast.success("Data submitted and email sent successfully!");
    } catch (error: any) {
      console.error("Error in sendEmail function:", error.message);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

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
                name
              </td>
              <td className="p-3 border">{student.name}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                date of birth
              </td>
              <td className="p-3 border">{student.dateOfBirth}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                degree
              </td>
              <td className="p-3 border">{student.degree}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                branch
              </td>
              <td className="p-3 border">{student.branch}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                yearOfPassing
              </td>
              <td className="p-3 border">{student.yearOfPassing}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                yearOfStudy
              </td>
              <td className="p-3 border">{student.yearOfStudy}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                yearOfStudy
              </td>
              <td className="p-3 border">{student.yearOfStudy}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                backlogs
              </td>
              <td className="p-3 border">{student.backlogs}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 border font-semibold bg-gray-100 capitalize">
                classObtain
              </td>
              <td className="p-3 border">{student.classObtain}</td>
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
                    className="text-blue-500 hover:underline"
                  >
                    {i}-File-{fileId}
                  </a>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex p-5 gap-5">
          <h1>Send Email</h1>
          <select
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Email</option>
            <option value="deepakpmk9600@gmail.com">
              deepakpmk9600@gmail.com
            </option>
          </select>
          <button
            className="bg-blue-400 font-semibold rounded-md p-2"
            onClick={sendEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : `Send Email to ${email}`}
          </button>
        </div>
      </div>
    </div>
  );
}
