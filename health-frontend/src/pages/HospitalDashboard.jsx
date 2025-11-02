import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sample default doctors (for first-time load)
const sampleDoctors = [
  {
    id: 1,
    name: "Dr. Aisha Khan",
    email: "aisha@example.com",
    specialty: "Cardiology",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Dr. Rohit Verma",
    email: "rohit@example.com",
    specialty: "Orthopedics",
    phone: "234-567-8901",
  },
];

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    phone: "",
  });

  // Load hospital & admin info + doctors
  useEffect(() => {
    const hospitalId = localStorage.getItem("hospitalId") || "HOSP-001";
    const token = localStorage.getItem("adminToken") || null;
    console.log("🏥 HospitalDashboard Loaded →", { hospitalId, token });

    const saved = JSON.parse(
      localStorage.getItem("hospital_doctors_" + hospitalId) || "null"
    );
    setDoctors(saved || sampleDoctors);
  }, []);

  // Save doctors in localStorage whenever they change
  useEffect(() => {
    const hospitalId = localStorage.getItem("hospitalId") || "HOSP-001";
    localStorage.setItem(
      "hospital_doctors_" + hospitalId,
      JSON.stringify(doctors)
    );
  }, [doctors]);

  // Handle form open/close
  const openAddForm = () => {
    setEditingDoctor(null);
    setForm({ name: "", email: "", specialty: "", phone: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      phone: doctor.phone,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDoctor(null);
  };

  // Handle form input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add or edit doctor
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please provide name and email for the doctor.");
      return;
    }

    if (editingDoctor) {
      // Update existing
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editingDoctor.id ? { ...d, ...form } : d
        )
      );
    } else {
      // Add new
      const id = doctors.length
        ? Math.max(...doctors.map((d) => d.id)) + 1
        : 1;
      setDoctors((prev) => [...prev, { id, ...form }]);
    }

    closeForm();
  };

  // Delete doctor
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // Mock hospital & admin profile
  const hospitalProfile = {
    name: localStorage.getItem("hospitalName") || "CityCare Hospital",
    address: "123 Health St, Springfield",
    contact: "+1 (555) 987-6543",
    beds: 120,
  };

  const adminProfile = {
    name: localStorage.getItem("adminName") || "Admin User",
    email: localStorage.getItem("adminEmail") || "admin@hospital.com",
    role: "Hospital Administrator",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-green-50 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: profiles */}
          <div className="md:col-span-1 space-y-6">
            {/* Hospital Profile */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-xl font-semibold text-emerald-700 mb-2">
                Hospital Profile
              </h2>
              <p className="text-gray-700 font-medium">{hospitalProfile.name}</p>
              <p className="text-sm text-gray-500">{hospitalProfile.address}</p>
              <p className="text-sm text-gray-500">
                Contact: {hospitalProfile.contact}
              </p>
              <p className="text-sm text-gray-500">
                Beds: {hospitalProfile.beds}
              </p>
              <button
                className="mt-3 inline-block bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                onClick={() => alert("Edit hospital profile (not implemented)")}
              >
                Edit Profile
              </button>
            </div>

            {/* Admin Profile */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-xl font-semibold text-emerald-700 mb-2">
                Admin Profile
              </h2>
              <p className="text-gray-700 font-medium">{adminProfile.name}</p>
              <p className="text-sm text-gray-500">{adminProfile.email}</p>
              <p className="text-sm text-gray-500">{adminProfile.role}</p>
              <button
                className="mt-3 inline-block bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                onClick={() => alert("View admin profile (not implemented)")}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Right column: doctor management */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-700">Doctors</h2>
                <p className="text-gray-500">
                  Manage hospital doctors: add, update, or remove.
                </p>
              </div>
              <div>
                <button
                  onClick={openAddForm}
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  + Add Doctor
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Specialty
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {doctors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No doctors found.
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-4 py-3">{doc.name}</td>
                        <td className="px-4 py-3">{doc.specialty}</td>
                        <td className="px-4 py-3">{doc.email}</td>
                        <td className="px-4 py-3">{doc.phone}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => openEditForm(doc)}
                            className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-emerald-700">
                    {editingDoctor ? "Edit Doctor" : "Add Doctor"}
                  </h3>

                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Specialty</label>
                    <input
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-600 text-white"
                    >
                      {editingDoctor ? "Save" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HospitalDashboard;
