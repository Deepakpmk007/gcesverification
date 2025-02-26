"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Student = {
  _id: string;
  verified: boolean;
};

export default function Page() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [verifiedStudents, setVerifiedStudents] = useState(0);
  const [notVerifiedStudents, setNotVerifiedStudents] = useState(0);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gcesverification.vercel.app/api/data",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();

        const verified = res.data.filter(
          (student: Student) => student.verified
        );
        const notVerified = res.data.filter(
          (student: Student) => !student.verified
        );

        setTotalStudents(res.data.length);
        setVerifiedStudents(verified.length);
        setNotVerifiedStudents(notVerified.length);

        setChartData({
          labels: ["Verified", "Not Verified"],
          datasets: [
            {
              label: "Verification Status",
              data: [verified.length, notVerified.length],
              backgroundColor: ["#4CAF50", "#F44336"],
              hoverOffset: 7,
            },
          ],
        });
      } catch (error: any) {
        console.error("Failed to fetch data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="p-6 text-blue-500 font-semibold">Loading...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-500 font-semibold">
        Error: {error}. Please try again later.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-3xl font-extrabold mb-4">Dashboard</h1>

      <div className="flex gap-5 flex-wrap">
        <div className="p-6 bg-green-100 flex-1 rounded-lg shadow-md">
          <p className="text-2xl font-bold">Total Students</p>
          <span className="text-[3rem]">{totalStudents}</span>
        </div>
        <div className="p-6 bg-green-100 flex-1 rounded-lg shadow-md">
          <p className="text-2xl font-bold">Total Verified Students</p>
          <span className="text-[3rem]">{verifiedStudents}</span>
        </div>
        <div className="p-6 bg-green-100 flex-1 rounded-lg shadow-md">
          <p className="text-2xl font-bold">Total Not Verified Students</p>
          <span className="text-[3rem]">{notVerifiedStudents}</span>
        </div>
      </div>

      <div className="p-6 bg-white w-[300px] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Verification Status Chart</h2>
        {chartData ? (
          <Doughnut data={chartData} aria-label="Verification Status Chart" />
        ) : (
          <p>Loading Doughnut Chart...</p>
        )}
      </div>
    </div>
  );
}
