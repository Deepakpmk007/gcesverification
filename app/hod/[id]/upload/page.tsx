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
        className="mb-4"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Student Records</h2>
        </div>

        <div className="flex mb-4 space-x-4">
          <div>
            <label htmlFor="branch" className="mr-2 font-medium">
              Filter by Branch:
            </label>
            <select
              id="branch"
              className="border px-2 py-1 rounded"
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

          <div>
            <label htmlFor="year" className="mr-2 font-medium">
              Filter by Year:
            </label>
            <select
              id="year"
              className="border px-2 py-1 rounded"
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

          <div>
            <label htmlFor="name" className="mr-2 font-medium">
              Search by Name:
            </label>
            <input
              id="name"
              type="text"
              className="border px-2 py-1 rounded"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by name"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Reg No</th>
                  <th className="border px-2 py-1">Year</th>
                  <th className="border px-2 py-1">DOB</th>
                  <th className="border px-2 py-1">Branch</th>
                  <th className="border px-2 py-1">Duration</th>
                  <th className="border px-2 py-1">CGPA</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{student.name}</td>
                    <td className="border px-2 py-1">{student.regNo}</td>
                    <td className="border px-2 py-1">
                      {student.yearOfPassing}
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">{student.branch}</td>
                    <td className="border px-2 py-1">{student.duration}</td>
                    <td className="border px-2 py-1">{student.cgpa}</td>
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
