"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/data", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        setStudents(res.data);
      } catch (err) {
        setError("Failed to fetch student data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Data</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full"
          aria-label="Search students by name"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && !error && (
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
                  <td className="p-3 border text-blue-500 hover:underline">
                    <Link href={`/admin/student/${student._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <p className="mt-4 text-red-500">No students found.</p>
          )}
        </div>
      )}
    </div>
  );
}
