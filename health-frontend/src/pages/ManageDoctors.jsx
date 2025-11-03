// src/pages/ManageDoctors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin/hospital/doctors";

const ManageDoctors = () => {
  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showOtherSpecialization, setShowOtherSpecialization] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    otherSpecialization: "",
    experienceYears: "",
    qualification: "",
    description: "",
    consultationFee: "",
    appointmentFee: "",
    image: null,
  });

  const specializations = [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "Pediatrics",
    "Others",
  ];

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/my-doctors`, { headers });
      setDoctors(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      otherSpecialization: "",
      experienceYears: "",
      qualification: "",
      description: "",
      consultationFee: "",
      appointmentFee: "",
      image: null,
    });
    setEditingDoctor(null);
    setShowOtherSpecialization(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name || "",
      email: doctor.email || "",
      phoneNumber: doctor.phoneNumber || "",
      specialization: specializations.includes(doctor.specialization)
        ? doctor.specialization
        : "Others",
      otherSpecialization: specializations.includes(doctor.specialization)
        ? ""
        : doctor.specialization,
      experienceYears: doctor.experienceYears || "",
      qualification: doctor.qualification || "",
      description: doctor.description || "",
      consultationFee: doctor.consultationFee || "",
      appointmentFee: doctor.appointmentFee || "",
      image: null,
    });
    setShowOtherSpecialization(!specializations.includes(doctor.specialization));
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "specialization") {
        setShowOtherSpecialization(value === "Others");
        if (value !== "Others") setForm((prev) => ({ ...prev, otherSpecialization: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    const specialization =
      form.specialization === "Others" ? form.otherSpecialization : form.specialization;

    const doctorData = {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      specialization,
      experienceYears: Number(form.experienceYears),
      qualification: form.qualification,
      description: form.description,
      consultationFee: Number(form.consultationFee),
      appointmentFee: Number(form.appointmentFee),
    };

    formData.append(
      "doctor",
      new Blob([JSON.stringify(doctorData)], { type: "application/json" })
    );
    if (form.image) formData.append("image", form.image);

    try {
      if (editingDoctor) {
        await axios.put(`${API_BASE}/update/${editingDoctor.id}`, formData, { headers });
        alert("Doctor updated successfully!");
      } else {
        await axios.post(`${API_BASE}/add`, formData, { headers });
        alert("Doctor added successfully!");
      }
      setModalOpen(false);
      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to save doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}`, { headers });
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor");
    }
  };

  return (
    <div className="p-6 flex-1 bg-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-700">Manage Doctors</h1>
        <button
          onClick={openAddModal}
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-400"
        >
          Add Doctor
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading doctors...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Doctor</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Specialization</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {doc.imageUrl ? (
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {doc.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {doc.name}
                  </td>
                  <td className="px-4 py-2">{doc.email}</td>
                  <td className="px-4 py-2">{doc.specialization}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 overflow-y-auto pt-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              {editingDoctor ? "Update Doctor" : "Add Doctor"}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />

              {/* Email only on add */}
              {!editingDoctor && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              )}

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />

              <select
                name="specialization"
                value={form.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Specialization</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {showOtherSpecialization && (
                <input
                  type="text"
                  name="otherSpecialization"
                  placeholder="Enter specialization"
                  value={form.otherSpecialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              )}

              <input
                type="number"
                name="experienceYears"
                placeholder="Experience Years"
                value={form.experienceYears}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="qualification"
                placeholder="Qualification"
                value={form.qualification}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                name="consultationFee"
                placeholder="Consultation Fee"
                value={form.consultationFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                name="appointmentFee"
                placeholder="Appointment Fee"
                value={form.appointmentFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full py-1"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-400"
                >
                  {submitting
                    ? editingDoctor
                      ? "Updating..."
                      : "Adding..."
                    : editingDoctor
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
