"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
export default function page() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    console.log("URL Parameter ID:", id); // Debugging: Check if id is correct

    if (!id) {
      setError("No student ID found in URL");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `https://gcesverification.vercel.app/api/getData?id=${id}`
        );
        const data = await res.json();

        console.log("Fetched Data:", data.data[0]); // Debugging: Check API response

        if (data.success) {
          setStudent(data.data[0]);
        } else {
          setError(data.message || "Student not found");
        }
      } catch (err) {
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);
  return <div>hi</div>;
}
