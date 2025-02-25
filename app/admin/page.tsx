"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function Page() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [verifiedStudents, setVerifiedStudents] = useState(0);
  const [notVerifiedStudents, setNotVerifiedStudents] = useState(0);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();

        const verified = res.data.filter((student: any) => student.verified);
        const notVerified = res.data.filter(
          (student: any) => !student.verified
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
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-1">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>

      <div className="flex gap-5 flex-wrap">
        <div className="p-6 bg-green-50 flex-1">
          <p className="text-2xl font-bold">Total Students</p>
          <span className="text-[3rem]">{totalStudents}</span>
        </div>
        <div className="p-6 bg-green-50 flex-1">
          <p className="text-2xl font-bold">Total Verified Students</p>
          <span className="text-[3rem]">{verifiedStudents}</span>
        </div>
        <div className="p-6 bg-green-50 flex-1">
          <p className="text-2xl font-bold">Total Not Verified Students</p>
          <span className="text-[3rem]">{notVerifiedStudents}</span>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="p-6 bg-white w-[300px] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Chart</h2>
        {chartData ? (
          <Doughnut data={chartData} />
        ) : (
          <p>Loading Doughnut Chart...</p>
        )}
      </div>

      {/* Pie Chart
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Pie Chart</h2>
        {chartData ? <Pie data={chartData} /> : <p>Loading Pie Chart...</p>}
      </div> */}
    </div>
  );
}
