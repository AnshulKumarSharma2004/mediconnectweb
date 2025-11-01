import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get email from navigation (passed during signup)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      sendOtp(location.state.email); // 🔹 Auto-send OTP when page opens
    } else {
      alert("Email not found! Please signup again.");
      navigate("/signup");
    }
  }, [location, navigate]);

  // 🔹 Send OTP API call
  const sendOtp = async (email) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/send-otp?email=${email}`
      );
      console.log(response.data);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // 🔹 OTP input handler
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1].focus();
    if (!value && index > 0) inputRefs.current[index - 1].focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  // 🔹 Verify OTP API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/verify-otp?email=${email}&otp=${enteredOtp}`
      );

      console.log("OTP Verified:", response.data);
      alert("OTP verified successfully!");

      // ✅ Redirect after success
      navigate("/");
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">
            Verify OTP
          </h2>
          <p className="text-emerald-600 mb-6">
            Enter the 4-digit OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  className="w-14 h-14 text-center text-2xl border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isComplete}
              className={`w-full py-2 rounded text-white transition ${
                isComplete
                  ? "bg-emerald-500 hover:bg-emerald-400"
                  : "bg-emerald-300 cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>
          </form>

          <p className="mt-4 text-sm text-emerald-600">
            Didn’t receive the code?{" "}
            <button
              onClick={() => sendOtp(email)}
              className="font-semibold underline hover:text-emerald-700"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OtpVerification;
