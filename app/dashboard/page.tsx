// app/dashboard/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/"); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <p className="text-lg mb-4">
        Our admin will add you to the Telegram channel within 24 hours.
      </p>
      <button
        onClick={handleGoHome}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default Dashboard;
