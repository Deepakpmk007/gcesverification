"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(
          ` http://localhost:3000/api/findById?id=${id}`
        );
        const res = await data.json();
        setData(res.data);
      } catch (err) {
        setError("Student not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) return <p className="text-lg font-semibold">Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>No data found</p>;
  return (
    <div className="flex flex-col gap-3 font-mono">
      <h3 className="p-6 bg-green-50 text-2xl font-bold">{data.email}</h3>
      <h3 className="p-6 bg-green-50 text-2xl font-bold">{data.name}</h3>
      <div className="p-6 bg-green-50 ">
        <p className="text-2xl font-bold">Total Students</p>
        <span className="text-[3rem]">{data.studentData.length}</span>
      </div>
    </div>
  );
}
