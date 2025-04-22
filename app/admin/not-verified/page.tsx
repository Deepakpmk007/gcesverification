"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Student = {
  _id: string;
  uniqueId: string;
  name: string;
  dateOfBirth: string;
  regNo: string;
  degree: string;
  yearOfPassing: string;
  verified: boolean;
};

export default function Page() {
  const [notVerifiedStudents, setNotVerifiedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await fetch("/api/data", {
          cache: "no-store",
        });
        if (!data.ok) {
          throw new Error("Failed to fetch data.");
        }
        const res = await data.json();
        setNotVerifiedStudents(
          res.data.filter((student: Student) => !student.verified)
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <p className="p-6 text-blue-500 font-semibold">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Not Verified Students</h1>

      {notVerifiedStudents.length === 0 ? (
        <p className="text-green-500 font-semibold">
          All students are verified ✅
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black shadow-lg">
            <thead>
              <tr className="bg-red-500 text-white">
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
              {notVerifiedStudents.map((student, index) => (
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
                  <td className="p-3 border text-center text-red-500 font-bold">
                    ❌ Not Verified
                  </td>
                  <td className="p-3 border">
                    <Link
                      href={`/admin/student/${student._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
