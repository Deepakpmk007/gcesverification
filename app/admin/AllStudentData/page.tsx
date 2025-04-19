"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface Student {
  name: string;
  regNo: string;
  yearOfPassing: number;
  dob: string;
  branch: string;
  duration: number;
  cgpa: number;
}

export default function UploadPage() {
  const [excelData, setExcelData] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [selectedBranch, selectedYear, searchName, students]);

  const fetchStudents = async () => {
    const res = await fetch("/api/AllUserData");
    const json = await res.json();
    if (json.success) {
      setStudents(json.data);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Student[] = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const uploadData = async () => {
    setUploading(true);
    setMessage("");
    try {
      const res = await fetch("/api/AllUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excelData),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Upload successful!");
        setExcelData([]);
        fetchStudents(); // Refresh table
      } else {
        setMessage(`Upload failed: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const filterStudents = () => {
    let filteredData = students;

    if (selectedBranch !== "All") {
      filteredData = filteredData.filter((s) => s.branch === selectedBranch);
    }

    if (selectedYear !== "All") {
      filteredData = filteredData.filter(
        (s) => s.yearOfPassing === parseInt(selectedYear)
      );
    }

    if (searchName) {
      filteredData = filteredData.filter((s) =>
        s.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFiltered(filteredData);
  };

  const branches = Array.from(new Set(students.map((s) => s.branch)));
  const years = Array.from(
    new Set(students.map((s) => s.yearOfPassing.toString()))
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Student Excel</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 border p-2 rounded-md"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={uploadData}
        disabled={uploading || excelData.length === 0}
      >
        {uploading ? "Uploading..." : "Upload Data"}
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {excelData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Preview Data</h2>
          <pre className="bg-gray-100 p-2 rounded max-h-64 overflow-y-auto text-sm">
            {JSON.stringify(excelData, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-10">
        <div className="flex gap-4 mb-6">
          <div className="w-1/3">
            <label htmlFor="branch" className="font-medium text-gray-600">
              Filter by Branch
            </label>
            <select
              id="branch"
              className="w-full border rounded-lg px-4 py-2 mt-2 text-gray-700"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="All">All</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label htmlFor="year" className="font-medium text-gray-600">
              Filter by Year
            </label>
            <select
              id="year"
              className="w-full border rounded-lg px-4 py-2 mt-2 text-gray-700"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label htmlFor="name" className="font-medium text-gray-600">
              Search by Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border rounded-lg px-4 py-2 mt-2 text-gray-700"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by name"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Reg No</th>
                  <th className="px-4 py-2 border">Year</th>
                  <th className="px-4 py-2 border">DOB</th>
                  <th className="px-4 py-2 border">Branch</th>
                  <th className="px-4 py-2 border">Duration</th>
                  <th className="px-4 py-2 border">CGPA</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={idx} className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.regNo}</td>
                    <td className="px-4 py-2 border">
                      {student.yearOfPassing}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">{student.branch}</td>
                    <td className="px-4 py-2 border">{student.duration}</td>
                    <td className="px-4 py-2 border">{student.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
