"use client";

import React, { useState, DragEvent, ChangeEvent } from "react";
import Header from "./components/Header";
import InputComponent from "./components/Input";
import { storeId } from "../lip/user/studentSlice";
import { useAppDispatch } from "@/lip/store";
import { useRouter } from "next/navigation";
import { appWriterStorage } from "./utils/appWriter";
import { ID } from "appwrite";

type Department = {
  name: string;
  shortForm: string;
};

type FileType = File;

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [regNo, setRegNo] = useState<number>();
  const [institution] = useState<string>(
    "Government College Of Engineering Srirangam,Trichy 620012"
  ); // Static value
  const [university] = useState<string>("Anna University Chennai"); // Static value
  const [degree] = useState<string>("B.E"); // Static value
  const [branch, setBranch] = useState<string>(""); // Branch as a string
  const [branchShort, setBranchShort] = useState<string>(""); // Branch short form as a string
  const [studyPeriod, setStudyPeriod] = useState<string>("");
  const [monthYearPassing, setMonthYearPassing] = useState<string>("");
  const [CGPA, setCGPA] = useState<string>();
  const [remarks, setRemarks] = useState<string>("");
  const [backlogs, setBacklogs] = useState<string>(""); // backlogs as string
  const [classObtained, setClassObtained] = useState<string>("");

  const [files, setFiles] = useState<FileType[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]); // To store Appwrite file IDs
  const [uploading, setUploading] = useState<boolean>(false);

  const departments: Department[] = [
    { name: "Computer Science and Engineering", shortForm: "CS" },
    { name: "Civil Engineering", shortForm: "CE" },
    { name: "Electronics and Communication Engineering", shortForm: "EC" },
    { name: "Electrical and Electronics Engineering", shortForm: "EE" },
    { name: "Mechanical Engineering", shortForm: "ME" },
  ];
  function getUniqueId() {
    if (!regNo) {
      return "";
    }
    const year = regNo.toString().slice(4, 6);
    const slice = year.slice(-2);
    return slice + branchShort + regNo.toString().slice(-3);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegNo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^8301\d{8}$/;
    if (regex.test(inputValue) || inputValue.length <= 12) {
      setRegNo(Number(inputValue));
    }
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShortDept = e.target.value;
    const department = departments.find(
      (dept) => dept.shortForm == selectedShortDept
    );

    if (selectedShortDept) {
      if (department) {
        setBranch(department.name);
      }
      setBranchShort(selectedShortDept);
    }
  };

  const fileUploadFile = async () => {
    if (files.length == 0) return;
    setUploading(true);
    try {
      const uploadIds: string[] = [];
      for (const file of files) {
        const response = await appWriterStorage.createFile(
          "676d799200277b1b2951",
          ID.unique(),
          file
        );
        console.log(response);
        uploadIds.push(response.$id); // Add file ID to the list
      }

      setFileIds(uploadIds);
    } catch (error) {
      console.error("File upload failed", error);
      alert("Failed to upload files.");
    } finally {
      setUploading(false);
    }
  };

  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!name || !regNo) {
      alert("Please fill out all required fields and upload files.");
      return;
    }
    const studentData = {
      uniqueId: getUniqueId(),
      name,
      dateOfBirth: dob,
      regNo,
      nameOfTheInstitution: institution,
      university,
      degree,
      branch: branch,
      branchShort,
      yearOfStudy: studyPeriod,
      yearOfPassing: monthYearPassing,
      CGPA: CGPA ?? "",
      remark: remarks,
      backlogs,
      classObtain: classObtained,
      file: files.map((file) => file.name),
      fileIds,
    };
    dispatch(storeId(studentData));
    router.push("/applicantData");
  };
  return (
    <>
      <Header />
      <main className="flex flex-col items-center w-full px-6 py-12 bg-gray-50 min-h-screen gap-10">
        {/* Form Section */}
        <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
            Student Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputComponent
              placeholder="Name"
              label="Student Name: (Initial at end)"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputComponent
              id="dob"
              placeholder="D.O.B"
              type="date"
              label="Date of Birth:"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <InputComponent
              id="regNo"
              placeholder="12 digit Register Number starting with 8301..."
              type="text"
              label="Register Number: (start with 8301)"
              value={regNo}
              onChange={handleRegNo}
            />
            <InputComponent
              id="institution"
              placeholder="College Name"
              type="text"
              label="Institution Name:"
              defaultValue="Government College Of Engineering Srirangam,Trichy 620012"
            />
            <InputComponent
              id="university"
              placeholder="Affiliated University"
              type="text"
              label="Affiliated University:"
              defaultValue="Anna University Chennai"
            />
            <InputComponent
              id="degree"
              placeholder="Degree"
              type="text"
              label="Degree:"
              defaultValue="B.E"
            />
            <div className="flex flex-col">
              <label htmlFor="branch" className="text-lg font-medium">
                Select Department:
              </label>
              <select
                id="branch"
                onChange={handleDeptChange}
                className="px-4 py-2 outline-none border-b-2 border-gray-500 focus:border-black rounded-md"
              >
                <option value="">--Select a Department--</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.shortForm}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <InputComponent
              id="studyPeriod"
              placeholder="2021 - 2025"
              type="text"
              label="Tenure of Study:"
              value={studyPeriod}
              onChange={(e) => setStudyPeriod(e.target.value)}
            />
            <InputComponent
              id="monthYearPassing"
              placeholder="APR 2024"
              type="text"
              label="Month & Year of Passing:"
              value={monthYearPassing}
              onChange={(e) => setMonthYearPassing(e.target.value)}
            />
            <InputComponent
              id="CGPA"
              placeholder="CGPA"
              type="text"
              label="CGPA:"
              value={CGPA ?? ""}
              onChange={(e) => setCGPA(e.target.value)}
            />
            <div className="flex flex-col">
              <label htmlFor="class" className="text-lg font-medium">
                Class Obtained:
              </label>
              <select
                id="class"
                onChange={(e) => setClassObtained(e.target.value)}
                value={classObtained}
                className="px-4 py-2 outline-none border-b-2 border-gray-500 focus:border-black rounded-md"
              >
                <option value="">Select an option</option>
                <option value="First Class with distinction">
                  First Class with distinction
                </option>
                <option value="First Class">First Class</option>
                <option value="Second Class">Second Class</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="backlogs" className="text-lg font-medium">
                Backlogs:
              </label>
              <select
                id="backlogs"
                onChange={(e) => setBacklogs(e.target.value)}
                value={backlogs}
                className="px-4 py-2 outline-none border-b-2 border-gray-500 focus:border-black rounded-md"
              >
                <option value="">Select an Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Adding Textarea Field */}
          </div>
          <div className="flex flex-col w-full ">
            <label htmlFor="notes" className="text-lg font-medium">
              Remarks:
            </label>
            <textarea
              id="notes"
              placeholder="Enter any additional information"
              className="px-4 py-2 border-2 border-dashed focus:border-black rounded-md h-32 resize-none w-full"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>
          {/* File Upload Section */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed p-4 rounded-lg flex flex-col items-center justify-center bg-gray-100 cursor-pointer"
          >
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-gray-600 text-lg mb-2">
                Drag and drop files here or click to upload
              </p>
            </label>
          </div>

          {/* File Preview Section */}
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border px-4 py-2 bg-white rounded-md shadow-md"
                >
                  <p className="truncate">{file.name}</p>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          onClick={fileUploadFile}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 w-full max-w-4xl">
          <button
            className="group flex items-center px-6 py-3 text-lg border border-black rounded-lg font-medium bg-green-300 hover:bg-green-500 text-white transition duration-300"
            onClick={handleClick}
          >
            Next →
          </button>
        </div>
      </main>
    </>
  );
}
