import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Added axios

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // ✅ for showing error
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/"); // already logged in → redirect home
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Submitted:", form);

    try {
      // ✅ API call to backend
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      console.log("Login Success:", response.data);

      // ✅ store token (assuming backend returns { token: "xyz" })
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <div className="md:w-1/2 bg-green-50 flex items-center justify-center p-8">
          <h2 className="text-3xl font-bold text-emerald-700 text-center">
            Welcome Back to MediConnect
          </h2>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center p-12">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />

              {/* ✅ Error message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-400 transition"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-center text-emerald-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold underline hover:text-emerald-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
