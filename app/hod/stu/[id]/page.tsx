"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appWriterStorage } from "@/app/utils/appWriter";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function StudentPage() {
  const { id } = useParams(); // Get student ID from URL
  const router = useRouter(); // Router for navigation
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const componentRef = useRef(null);

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

        console.log("Fetched Data:", data.data[0]); // Debugging: Check API response

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

  const generatePDF = async () => {
    const element = componentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = 90;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("student_details.pdf");
  };

  const sendEmail = async () => {
    setIsSending(true);
    const userResponse = await fetch(
      `https://gcesverification.vercel.app/api/findByEmail?email=${email}`
    );
    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(`User Fetch Error: ${userData.message}`);
    }

    const userId = userData.data._id;
    updateUserStudentData(userId, student._id);

    console.log("Fetched User ID:", userId);

    try {
      const emailResponse = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.SMTP_SERVER_USERNAME, // Sender's email
          sendTo: email, // Receiver's email
          subject: "Verification of Student Details", // Email subject
          text: `${student.remark}`, // HTML formatted email
          html: `
          <h1>Student Details</h1>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>DOB:</strong> ${student.dateOfBirth}</p>
          <p><strong>Degree:</strong> ${student.degree}</p>
          <p><strong>Branch:</strong> ${student.branch}</p>
          <p><strong>Year of Passing:</strong> ${student.yearOfPassing}</p>
          <p><strong>Year of Study:</strong> ${student.yearOfStudy}</p>
          <p><strong>Remark:</strong> ${student.remark}</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(
          `Email Error: ${emailResponse.status} - ${await emailResponse.text()}`
        );
      }

      toast.success("Data submitted and email sent successfully!");
    } catch (error: any) {
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  const handleSelectionChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const fields = [
    "name",
    "regNo",
    "dateOfBirth",
    "degree",
    "branch",
    "yearOfPassing",
    "yearOfStudy",
    "backlogs",
    "classObtain",
  ];
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
      <div className="border p-4 rounded shadow-lg bg-white"></div>
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 border">Field</th>
            <th className="p-3 border">Value</th>
          </tr>
        </thead>
        <tbody>
          {" "}
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
      <div className="border p-4 rounded shadow-lg bg-white">
        <div
          className="mt-5"
          ref={componentRef}
          style={{
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border">Field</th>
                <th className="p-3 border">Value</th>
                <th className="p-3 border">Yes/No</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field} className="border-b h-14">
                  <td className="p-3 border font-semibold bg-gray-200 capitalize">
                    {field}
                  </td>
                  <td className="p-3 border bg-white">{student[field]}</td>
                  <td>
                    <select
                      className="ml-2 p-1 rounded"
                      value={fieldValues[field] || ""}
                      onChange={(e) =>
                        handleSelectionChange(field, e.target.value)
                      }
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
          <button
            className="bg-green-400 px-4 py-2 rounded-lg hover:bg-green-500 transition"
            onClick={generatePDF}
          >
            Verified
          </button>
        </div>
        {/* <div className="flex p-5 gap-5">
          <h1>Send Email</h1>
          <select
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Email</option>
            <option value="deepakpmk007@gmail.com">
              deepakpmk007@gmail.com
            </option>
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
        </div> */}
      </div>
    </div>
  );
}
