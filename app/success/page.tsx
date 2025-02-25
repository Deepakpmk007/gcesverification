import React from "react";
import Header from "../components/Header";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Header />
      <div className="w-screen h-[81vh] flex justify-center items-center flex-col">
        <p className="text-2xl">
          ✅ Data submitted and email sent successfully!
        </p>
        <p className="text-xl">👍 Thank you using our service </p>
        <Link href="/" className="px-4 py-2 bg-red-500 mt-2 rounded-lg">
          Home
        </Link>
      </div>
    </>
  );
}
