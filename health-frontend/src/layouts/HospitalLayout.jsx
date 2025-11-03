import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import HospitalDashboard from "../pages/HospitalDashboard";
import ManageDoctors from "../pages/ManageDoctors";

const HospitalLayout = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const menuOptions = [
    { name: "Dashboard", component: <HospitalDashboard /> },
    { name: "Manage Doctors", component:  <ManageDoctors /> },
    { name: "All Doctors", component: <div>All Doctors Page</div> },
    { name: "Hospital Profile", component: <div>Hospital Profile Page</div> },
    { name: "Settings", component: <div>Settings Page</div> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-emerald-500 text-white w-64 p-4 space-y-6">
        {menuOptions.map((option) => (
          <div
            key={option.name}
            onClick={() => setCurrentPage(option.name)}
            className={`px-3 py-2 rounded cursor-pointer hover:bg-emerald-600 ${
              currentPage === option.name ? "bg-emerald-600 font-bold" : ""
            }`}
          >
            {option.name}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 overflow-auto p-6 bg-green-50">
          {menuOptions.find((opt) => opt.name === currentPage)?.component}
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;
