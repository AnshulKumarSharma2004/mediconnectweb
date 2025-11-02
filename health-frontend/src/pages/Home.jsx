import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { checkAuthAndHospital } from "../utils/auth";

const Home = () => {
  const navigate = useNavigate();

  // Only "Get Started" performs auth check
  const handleGetStarted = () => {
    console.log("🚀 Get Started clicked!");
    const { redirect } = checkAuthAndHospital();
    console.log("➡️ Navigating to:", redirect);
    navigate(redirect);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 p-12 bg-green-50">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold text-emerald-700 mb-6">
            Welcome to MediConnect
          </h1>
          <p className="mb-6 text-emerald-600">
            Manage hospital, doctor, and patient workflows easily on our platform.
          </p>

          {/* Get Started button triggers auth check */}
          <button
            onClick={handleGetStarted}
            className="bg-emerald-500 text-white px-6 py-3 rounded hover:bg-emerald-400 transition"
          >
            Get Started
          </button>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZuHLHwYnWkhQqx5JSK3XQbrwjHpEnYrmDNQ&s"
            alt="Healthcare"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
