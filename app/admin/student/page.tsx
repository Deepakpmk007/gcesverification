"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gcesverification.vercel.app/api/data",
          {
            cache: "no-store",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const res = await response.json();
        setStudents(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter students by search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Data</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black shadow-lg">
          {/* Table Head */}
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

          {/* Table Body */}
          <tbody>
            {filteredStudents.map((student, index) => (
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
                  <Link href={`/admin/student/${student._id}`}>view</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Found Message */}
      {filteredStudents.length === 0 && (
        <p className="mt-4 text-red-500">No students found.</p>
      )}
    </div>
  );
}
