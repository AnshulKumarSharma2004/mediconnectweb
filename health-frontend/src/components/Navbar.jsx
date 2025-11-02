import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuthAndHospital } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle Login/Signup button click with auth check
  const handleLoginClick = () => {
    console.log("🚀 Login/Signup clicked!");
    const { redirect } = checkAuthAndHospital();
    console.log("➡️ Redirecting to:", redirect);
    navigate(redirect);
  };

  return (
    <nav className="bg-emerald-500 text-white px-8 py-4 flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold">MediConnect</div>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <Link to="/">
          <button className="hover:bg-emerald-400 px-4 py-2 rounded">Home</button>
        </Link>

        {/* Login / Signup - now checks auth */}
        <button
          onClick={handleLoginClick}
          className="hover:bg-emerald-400 px-4 py-2 rounded"
        >
          Login / Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
