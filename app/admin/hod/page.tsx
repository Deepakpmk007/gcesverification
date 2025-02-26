import React from "react";

export default async function Page() {
  try {
    const data = await fetch("http://localhost:3000/api/new-user", {
      cache: "no-store",
    });

    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }

    const res = await data.json();
    console.log(res); // Inspect the API response

    if (!res?.data || !Array.isArray(res.data)) {
      throw new Error("Invalid or empty data received.");
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">HOD Data</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black shadow-lg">
            {/* Table Head */}
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Name</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {res.data.map((hod: any, index: number) => (
                <tr
                  key={hod._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="p-3 border">{hod._id}</td>
                  <td className="p-3 border">{hod.email}</td>
                  <td className="p-3 border">{hod.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-500">
          Error Loading HOD Data
        </h1>
        <p className="text-gray-700">
          {error instanceof Error
            ? error.message
            : "An unknown error occurred."}
        </p>
      </div>
    );
  }
}
