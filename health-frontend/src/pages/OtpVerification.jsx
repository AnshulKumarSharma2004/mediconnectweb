import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // 🔹 track OTP sent once

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get email from signup page
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      alert("Email not found! Please signup again.");
      navigate("/signup");
    }
  }, [location, navigate]);

  // 🔹 Send OTP only once when page opens
  useEffect(() => {
    if (email && !otpSent) {
      sendOtp(email);
      setOtpSent(true);
    }
  }, [email, otpSent]);

  // 🔹 Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 🔹 Send OTP API
  const sendOtp = async (emailParam) => {
    try {
      await axios.post(`http://localhost:8080/api/auth/send-otp?email=${emailParam}`);
      alert("OTP sent to your email!");
      setTimer(300); // reset 5 min timer
      setCanResend(false);
      setOtp(["", "", "", ""]); // clear input
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
    if (!value && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const isComplete = otp.every(digit => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;

    const enteredOtp = otp.join("");
    try {
      await axios.post(`http://localhost:8080/api/auth/verify-otp?email=${email}&otp=${enteredOtp}`);
      alert("OTP verified successfully!");
      navigate("/login"); // redirect after success
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Verify OTP</h2>
          <p className="text-emerald-600 mb-6">Enter the 4-digit OTP sent to your email</p>

          <button
            onClick={() => sendOtp(email)}
            disabled={!canResend}
            className={`mb-4 font-semibold underline transition ${
              canResend
                ? "hover:text-emerald-700 cursor-pointer"
                : "cursor-not-allowed text-gray-400"
            }`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${formatTime(timer)}`}
          </button>

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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OtpVerification;
