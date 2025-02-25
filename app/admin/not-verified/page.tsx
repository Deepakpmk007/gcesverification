import Link from "next/link";
import React from "react";

export default async function Page() {
  const data = await fetch("/api/data", {
    cache: "no-store",
  });
  const res = await data.json();

  // Filter only students who are not verified
  const notVerifiedStudents = res.data.filter(
    (student: any) => !student.verified
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Not Verified Students</h1>

      {notVerifiedStudents.length === 0 ? (
        <p className="text-red-500 font-semibold">
          All students are verified ✅
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black shadow-lg">
            {/* Table Head */}
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
                <th className="p-3 border">view</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {notVerifiedStudents.map((student: any, index: number) => (
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
                    <Link href={`/admin/student/${student._id}`}>view</Link>
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
