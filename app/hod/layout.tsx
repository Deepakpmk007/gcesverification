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
    { href: `/hod/${id}/student`, label: "All Students" },
    { href: `/hod/${id}/verified`, label: "Verified Students" },
    { href: `/hod/${id}/not-verified`, label: "Not Verified Students" },
    { href: `/hod/${id}/upload`, label: "upload student data" },
  ];

  return (
    <WithAuth requiredRole="hod">
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <nav className="flex justify-between items-center w-full p-4 bg-blue-500 text-white">
          <Link
            href="/"
            className="font-bold text-lg md:text-2xl tracking-wide"
          >
            Government College of Engineering Srirangam, Trichy-620012
          </Link>
          <h2 className="text-lg font-semibold">HOD Panel</h2>
        </nav>

        {/* Sidebar & Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="bg-blue-500 flex flex-col gap-2 w-48 p-5 text-white">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  pathname === href
                    ? "bg-blue-700"
                    : "hover:bg-blue-600 bg-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </aside>

          {/* Main Content (Scrollable) */}
          <main className="flex-1 p-6 bg-blue-100 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </WithAuth>
  );
}
