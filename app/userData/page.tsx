"use client";

import React from "react";
import { useAppSelector } from "@/lip/store";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const UserDetails = () => {
  const student = useAppSelector((state) => state.studentId.value);
  const applicant = useAppSelector((state) => state.applicantData.value);
  const router = useRouter();

  // Merge data for posting (excluding file, fileIds, uniqueId)
  const postData = { ...student, ...applicant };
  console.log(postData);

  // Function to filter unwanted fields
  const filterData = (data: any) => {
    return Object.entries(data)
      .filter(
        ([key, value]) =>
          key !== "uniqueId" &&
          key !== "fileNames" &&
          key !== "fileIds" &&
          value
      ) // Exclude empty values
      .map(([key, value]) => ({
        key: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()), // Format key
        value: Array.isArray(value) ? value.join(", ") : value, // Convert array to string
      }));
  };

  const handSubmit = async () => {
    try {
      console.log("Submitting Data:", JSON.stringify(postData, null, 2));

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const responseText = await response.text();
      router.push("/success"); // Read raw response text
      console.log("Response Status:", response.status);
      console.log("Response Text:", responseText);

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} - ${responseText}`);
      }

      toast.success("Data submitted successfully!");
    } catch (error: any) {
      console.error("Submission failed", error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto bg-slate-300 rounded-lg shadow-xl p-6 space-y-6">
        {/* Student Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filterData(student).map(({ key, value }) => (
              <div key={key} className="text-sm font-medium text-gray-600">
                {key}:
                <span className="block text-lg font-semibold text-gray-900">
                  {value as React.ReactNode}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Applicant Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Applicant Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filterData(applicant).map(({ key, value }) => (
              <div key={key} className="text-sm font-medium text-gray-600">
                {key}:
                <span className="block text-lg font-semibold text-gray-900">
                  {value as React.ReactNode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between w-full mt-6">
        <button className="px-6 py-3 border border-black rounded-lg text-lg font-medium hover:bg-red-600 hover:text-white transition duration-300">
          ← Back
        </button>
        <button
          className="px-6 py-3 border border-black rounded-lg text-lg font-medium hover:bg-green-400 hover:text-white transition duration-300"
          onClick={handSubmit}
        >
          Next →
        </button>
      </div>
    </main>
  );
};

export default UserDetails;
