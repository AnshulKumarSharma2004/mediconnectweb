// HospitalLogin.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HospitalLogin = () => {
  const [form, setForm] = useState({ email: "", registrationNumber: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) setError("Admin not logged in. Please login first.");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const response = await axios.post(
        "http://localhost:8080/api/admin/hospitals/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("hospitalId", response.data.id);
      localStorage.setItem("isHospitalLoggedIn", "true");

     navigate("/hospital");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid registration number or email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/hospital/register");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <div className="md:w-1/2 bg-blue-50 flex items-center justify-center p-8">
          <h2 className="text-3xl font-bold text-emerald-700 text-center">
            Welcome Hospital Admin
          </h2>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center p-12">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
              Hospital Login
            </h2>
            {loading && (
              <div className="text-center text-emerald-700 font-bold mb-4">
                Logging in...
              </div>
            )}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Hospital Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                value={form.registrationNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-center text-blue-600">
              Don’t have a hospital account?{" "}
              <button
                onClick={handleRegisterClick}
                className="font-semibold underline hover:text-blue-700"
              >
                Register Hospital
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalLogin;
