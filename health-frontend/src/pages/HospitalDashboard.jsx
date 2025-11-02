import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HospitalDashboard = () => {
  useEffect(() => {
    const hospitalId = localStorage.getItem("hospitalId");
    const token = localStorage.getItem("adminToken");
    console.log("🏥 HospitalDashboard Loaded →", { hospitalId, token });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-green-50 p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-emerald-700 mb-4">
            Hospital Dashboard
          </h1>
          <p className="text-gray-700 mb-2">
            Welcome! You are now logged in to your hospital dashboard.
          </p>
          <p className="text-gray-500">(Content and features coming soon)</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalDashboard;
