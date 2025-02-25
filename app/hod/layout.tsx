"use client"; // Ensure this runs only on the client side

import WithAuth from "@/lip/withAuth";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Get current route
  const { id } = useParams();

  const navLinks = [
    { href: `/hod/${id}`, label: "Home" },
    { href: `/hod/${id}/student`, label: "All Student" },
    { href: `/hod/${id}/verified`, label: "Verified Student" },
    { href: `/hod/${id}/not-verified`, label: "Not Verified Student" },
  ];

  return (
    // <WithAuth requiredRole="hod">
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full p-6 bg-blue-400">
        <Link
          href={"/"}
          className="font-bold text-xl tracking-wide md:text-2xl  "
        >
          Government College of Engineering Srirangam,Trichy 620012
        </Link>
        <h2 className="text-lg font-bold">HOD Panel</h2>
      </nav>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="bg-blue-400 flex flex-col gap-4 w-[15%] p-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-sm transition duration-300 ${
                pathname === href ? "bg-blue-600 text-white" : "bg-blue-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Main Content (Scrollable) */}
        <div className="flex-1 p-6 bg-blue-200 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
    // </WithAuth>
  );
}
