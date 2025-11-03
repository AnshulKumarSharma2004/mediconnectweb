import React, { useEffect, useState } from "react";

const HospitalDashboard = () => {
  const [adminName, setAdminName] = useState("");
  
  // Default counts
  const [totalDoctors, setTotalDoctors] = useState(12);
  const [appointmentsToday, setAppointmentsToday] = useState(5);
  const [totalPatients, setTotalPatients] = useState(20);
  const [pendingAppointments, setPendingAppointments] = useState(3);

  useEffect(() => {
    const name = localStorage.getItem("adminName") || "Dashboard";
    setAdminName(name);
  }, []);

  const cards = [
    { title: "Total Doctors", count: totalDoctors },
    { title: "Appointments Today", count: appointmentsToday },
    { title: "Total Patients", count: totalPatients },
    { title: "Pending Appointments", count: pendingAppointments },
  ];

  return (
    <div className="p-6 flex-1 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">
        Hi, {adminName}
      </h1>
      <p className="text-gray-600 mb-6">Welcome to your Dashboard.</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white shadow rounded-lg p-6 flex flex-col justify-center items-center"
          >
            <h2 className="text-gray-500 text-lg text-center">{card.title}</h2>
            <p className="text-3xl font-bold text-emerald-700 mt-2 text-center">
              {card.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalDashboard;
