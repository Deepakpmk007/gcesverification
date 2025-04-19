"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appWriterStorage } from "@/app/utils/appWriter";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Link } from "lucide-react";

export default function StudentPage() {
  const { stuid } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string>("");
  const [verifiedBy, setVerifiedBy] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const componentRef = useRef(null);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    console.log("URL Parameter ID:", stuid);

    if (!stuid) {
      setError("No student ID found in URL");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(
          ` http://localhost:3000/api/getData?id=${stuid}`
        );
        const data = await res.json();

        console.log("Fetched Data:", data.data[0]);

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
  }, [stuid]);
  // console.log(student);

  const updateUserStudentData = async () => {
    try {
      setIsSending(true);
      const res = await fetch(" http://localhost:3000/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student._id,
          verifiedBy,
        }),
      });
      const data = await res.json();
      generatePDF();
      router.push(`/hod/stu/${student._id}/verified`);
      if (data.success) {
        toast.success("Student data updated successfully");
      } else {
        toast.error(data.error || "Failed to update student data");
      }
    } catch (error) {
      toast.error("Failed to update student data");
    } finally {
      setIsSending(false);
    }
  };

  const generatePDF = async () => {
    const element = componentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);

    if (imgHeight < pdfHeight - 50) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, imgHeight + margin + 5, pdfWidth - 2 * margin, 30, "F");
    }

    if (signature) {
      const sigWidth = 60;
      const sigHeight = 30;

      const sigX = pdfWidth - sigWidth - margin;
      const sigY = pdfHeight - sigHeight - margin;

      pdf.addImage(signature, "PNG", sigX, sigY, sigWidth, sigHeight);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("HOD Signature", sigX + 5, sigY + sigHeight + 8);
    }

    pdf.save("student_details.pdf");
  };

  const handleSelectionChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignature(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">id</td>
            <td className="p-3 border">{student._id}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
              remark
            </td>
            <td className="p-3 border">{student.remark}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
              verified
            </td>
            <td className="p-3 border">
              {student.verified ? `✅ verified` : `❌ not-verified`}
            </td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
              verified By
            </td>
            <td className="p-3 border">{student.verifiedBy}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
              agency name
            </td>
            <td className="p-3 border">{student.agencyName}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
              sender email
            </td>
            <td className="p-3 border">{student.senderEmail}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border font-semibold bg-white capitalize">
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
                    "67c68a2e0022fc16e9d5",
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
      <div className="mt-5">
        <label className="block font-semibold">Upload Signature:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          className="border p-2 rounded"
        />
      </div>
      <div className="border p-4 rounded shadow-lg bg-white">
        <div
          className="mt-5 flex flex-col items-center w-full"
          ref={componentRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            backgroundColor: "white",
          }}
        >
          <h2 className="text-2xl font-bold text-center">
            Government College of Engineering Srirangam, Trichy-620012
          </h2>

          <table className="w-full border-collapse border mt-10 border-black shadow-md">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="p-3 border text-center w-1/3">Field</th>
                <th className="p-3 border text-center w-1/3">Value</th>
                <th className="p-3 border text-center w-1/3">Yes/No</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field} className="border-b h-12">
                  <td className="p-3 border font-semibold bg-white capitalize text-center">
                    {field}
                  </td>
                  <td className="p-3 border bg-white text-center">
                    {student[field]}
                  </td>
                  <td className="p-3 border bg-white text-center">
                    <select
                      className="p-1 rounded bg-transparent text-center"
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
              <tr className="border h-14">
                <td className="p-3 border font-semibold bg-white capitalize text-center">
                  Verified
                </td>
                <td className="p-3 border bg-white text-center" colSpan={2}>
                  {verifiedBy}
                </td>
              </tr>
            </tbody>
          </table>
          {/*           
          {signature && (
            <div className="mt-10 flex justify-end items-end w-full flex-col">
              <img
                src={signature}
                alt="Signature"
                className="w-32 h-auto mx-auto border-none"
              />
              <h2 className="text-lg font-semibold">HOD Signature</h2>
            </div>
          )} */}
        </div>

        <div className="mt-5 flex gap-5">
          <input
            className="border px-3"
            onChange={(e) => setVerifiedBy(e.target.value)}
          />
          <button
            className="bg-green-400 px-4 py-2 rounded-lg hover:bg-green-500 transition"
            onClick={updateUserStudentData}
          >
            Verified
          </button>
        </div>
      </div>
    </div>
  );
}
