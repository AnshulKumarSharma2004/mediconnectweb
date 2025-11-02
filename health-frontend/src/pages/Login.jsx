import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      const { token } = response.data;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("isLoggedIn", "true");
      try {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(atob(base64));

  console.log("🟢 JWT Decoded:", decodedData);
  console.log("📅 Expiration (epoch):", decodedData.exp);
  console.log("🕒 Expiration (readable):", new Date(decodedData.exp * 1000));
  console.log("🕒 Current Time:", new Date());
} catch (e) {
  console.error("❌ JWT Decode failed:", e);
}

      navigate("/hospital-login"); // Go to hospital login after admin login
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(
        err.response?.data?.message || "Invalid email or password. Try again."
      );
    } finally {
      setLoading(false);
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
                required
                className="w-full px-4 py-2 border border-emerald-300 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-emerald-300 rounded"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center text-emerald-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="underline font-semibold"
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
