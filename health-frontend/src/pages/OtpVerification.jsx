import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp.join(""));

    // OTP backend verification here
    // On success → redirect home
    navigate("/");
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
            <button className="font-semibold underline hover:text-emerald-700">
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
