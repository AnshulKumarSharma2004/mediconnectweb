import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Profile icon

const DashboardNavbar = () => {
  return (
    <nav className="bg-emerald-700 text-white flex justify-between items-center px-4 py-4 shadow-md">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold cursor-pointer">MediConnect</div>

      {/* Profile Icon */}
      <div className="flex items-center space-x-4">
        <FaUserCircle className="text-3xl cursor-pointer hover:text-emerald-300 transition" />
      </div>
    </nav>
  );
};

export default DashboardNavbar;
