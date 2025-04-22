"use client"; // Ensure this runs only on the client side

import WithAuth from "@/lip/withAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Home" },
    { href: "/admin/student", label: "All Student" },
    { href: "/admin/verified", label: "Verified Student" },
    { href: "/admin/not-verified", label: "Not Verified Student" },
    { href: "/admin/hod", label: "HOD" },
    { href: "/admin/createNewUser", label: "Create User" },
    { href: "/admin/AllStudentData", label: "All Student" },
  ];

  return (
    <WithAuth requiredRole="admin">
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="flex justify-between items-center w-full p-6 bg-blue-500 shadow-md">
          <Link
            href="/"
            className="text-white font-bold text-xl tracking-wide md:text-2xl"
          >
            Government College of Engineering Srirangam, Trichy-620012
          </Link>
          <h2 className="text-white text-lg font-bold">Admin Panel</h2>
        </nav>

        {/* Sidebar & Main Content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside className="bg-blue-500 flex flex-col gap-4 w-[15%] min-w-[200px] p-6 overflow-y-auto shadow-md">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`px-3 py-2 rounded-md transition duration-300 font-medium ${
                  pathname === href
                    ? "bg-blue-700 text-white"
                    : "bg-blue-300 hover:bg-blue-400 text-gray-800"
                }`}
              >
                {label}
              </Link>
            ))}
          </aside>

          {/* Main Content (Scrollable) */}
          <main className="flex-1 p-6 bg-white overflow-y-auto h-full">
            {children}
          </main>
        </div>
      </div>
    </WithAuth>
  );
}
