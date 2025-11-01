import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "", // Backend field name
    role: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Submitted:", form);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup Successful:", response.data);

      // ✅ Pass email to OTP page
      navigate("/otp", { state: { email: form.email } });
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.response) {
        alert("Signup failed: " + error.response.data);
      } else {
        alert("Server not reachable. Try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Left Section */}
        <div className="md:w-1/2 bg-green-50 flex items-center justify-center p-8">
          <div className="text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSReZATVmh9Nu5VW7A5K_WHQVMvq_wisc8Yng&s"
              alt="Healthcare"
              className="rounded-lg shadow-lg mb-6"
            />
            <h2 className="text-3xl font-bold text-emerald-700">
              Welcome to MediConnect
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex flex-col justify-center p-12">
          <div className="max-w-md w-full mx-auto">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-emerald-500 text-2xl mr-2" />
                <h2 className="text-2xl font-bold text-emerald-700">Create Account</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="tel"
                name="phoneNo"
                placeholder="Phone Number"
                value={form.phoneNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Hospital_Admin</option>
                <option value="doctor">Doctor</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-400 transition"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
