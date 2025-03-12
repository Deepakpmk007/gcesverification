"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StudentListPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchStudentIds = async () => {
      try {
        const response = await fetch(
          `https://gcesverification.vercel.app/api/findById?id=${id}`
        );
        const result = await response.json();
        setIds(result.data.studentData || []);
      } catch (err) {
        console.error("Error fetching student IDs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentIds();
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchStudentsByIds = async (ids: string[]) => {
      if (!ids.length) return;

      try {
        const query = ids.map((id) => `id=${encodeURIComponent(id)}`).join("&");
        const response = await fetch(
          `https://gcesverification.vercel.app/api/getData?${query}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.status}`);
        }

        const result = await response.json();
        setStudents(result.data || []);
      } catch (error: any) {
        console.error("Error fetching students by IDs:", error.message);
      }
      setLoading(false);
    };

    fetchStudentsByIds(ids);
  }, [ids]);
  if (loading) return <p className="text-lg font-semibold">Loading data...</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Data</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Unique ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Date of Birth</th>
              <th className="p-3 border">Reg No</th>
              <th className="p-3 border">Degree</th>
              <th className="p-3 border">Year of Passing</th>
              <th className="p-3 border">Verified</th>
              <th className="p-3 border">View</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="p-3 border">{student._id}</td>
                <td className="p-3 border">{student.uniqueId}</td>
                <td className="p-3 border">{student.name}</td>
                <td className="p-3 border">{student.dateOfBirth}</td>
                <td className="p-3 border">{student.regNo}</td>
                <td className="p-3 border">{student.degree}</td>
                <td className="p-3 border">{student.yearOfPassing}</td>
                <td className="p-3 border text-center">
                  {student.verified ? "✅" : "❌"}
                </td>
                <td className="p-3 border">
                  <Link href={`/hod/stu/${student._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <p className="mt-4 text-red-500">No students found.</p>
      )}
    </div>
  );
}
