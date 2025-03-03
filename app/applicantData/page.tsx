"use client";

import React, { useState } from "react";
import InputComponent from "../components/Input";
import { storeEmail } from "../../lip/user/applicantSlice";
import { useAppDispatch } from "@/lip/store";
import { useRouter } from "next/navigation";

const ApplicantDataPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [agencyName, setAgencyName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [contact, setContact] = useState(0);

  const handleClick = () => {
    const applicentData = {
      agencyName,
      senderEmail,
      contact,
    };

    dispatch(storeEmail(applicentData));
    router.push("/userData");
  };
  return (
    <main className="flex flex-col items-center w-full px-6 py-12 space-y-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-10 items-center bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center sm:text-3xl">
          Agency/Verifier Details
        </h1>
        <main className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full">
          <InputComponent
            placeholder="Agency/Verifier Name & Place"
            label="Agency/Verifier Name & Place"
            id="name"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
          />
          <InputComponent
            id="email"
            placeholder="Email"
            type="email"
            label="Email:"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <InputComponent
            id="contact"
            placeholder="Contact Number"
            type="text"
            label="Contact Number:"
            value={contact}
            onChange={(e) => setContact(parseInt(e.target.value))}
          />
        </main>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-4xl px-4">
        <button className="group flex items-center justify-center gap-2 px-5 py-3 border border-black rounded-lg text-lg font-medium relative transition duration-300 hover:bg-red-600 hover:text-white">
          <span className="text-black group-hover:-translate-x-2 group-hover:text-white transition-transform duration-300">
            ←
          </span>
          Back
        </button>
        <button
          className="group flex items-center justify-center gap-2 px-5 py-3 border border-black rounded-lg text-lg font-medium relative transition duration-300 hover:bg-green-400 hover:text-white"
          onClick={handleClick}
        >
          Next
          <span className="text-black group-hover:translate-x-2 group-hover:text-white transition-transform duration-300 ">
            →
          </span>
        </button>
      </div>
    </main>
  );
};

export default ApplicantDataPage;
