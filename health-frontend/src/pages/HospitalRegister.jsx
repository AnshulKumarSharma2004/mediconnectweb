// src/pages/HospitalRegister.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px", // fixed height for map
};

const HospitalRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    website: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    latitude: 28.6139,
    longitude: 77.209,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles]);
    e.target.value = null; // reset input
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMarkerDrag = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    console.log("Marker moved to:", lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 2) {
      alert("Please select at least 2 images.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Auth Token:", token);
      console.log("Form Data:", form);
      console.log("Images:", images);

      if (!token) throw new Error("Admin token not found, please login");

      const formData = new FormData();
      formData.append(
        "hospital",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      images.forEach((img) => formData.append("images", img));

      const res = await axios.post(
        "http://localhost:8080/api/admin/hospitals/register-hospital",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", res.data);
      alert("Hospital registered successfully!");
      navigate("/hospital-login");
    } catch (err) {
      console.error("Registration Error:", err.response || err.message);
      alert(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8 bg-green-50">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
            Register Hospital
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Hospital Name" value={form.name} onChange={handleChange} required className="p-2 border rounded" />
              <input type="text" name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} required className="p-2 border rounded" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="p-2 border rounded" />
              <input type="text" name="website" placeholder="Website" value={form.website} onChange={handleChange} className="p-2 border rounded" />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required className="p-2 border rounded" />
            </div>

            {/* Address Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input type="text" name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} className="p-2 border rounded" />
              <input type="text" name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} className="p-2 border rounded" />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="p-2 border rounded" />
              <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className="p-2 border rounded" />
              <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} className="p-2 border rounded" />
              <input type="text" name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} className="p-2 border rounded" />
            </div>

            {/* Map */}
            <div>
              <label className="font-semibold text-gray-700 mb-2 block">
                Select Location
              </label>
              <div style={{ width: "100%", height: "300px" }}>
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: form.latitude, lng: form.longitude }}
                    zoom={15}
                  >
                    <Marker
                      position={{ lat: form.latitude, lng: form.longitude }}
                      draggable
                      onDragEnd={handleMarkerDrag}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Drag marker to set exact location
              </p>
            </div>

            {/* Image Upload */}
            <div className="my-4">
              <label className="block font-semibold mb-2">
                Hospital Images (min 2)
              </label>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" ref={fileInputRef} />
              <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Choose Files</button>

              {images.length > 0 ? (
                <ul className="mt-2">
                  {images.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeImage(index)} className="text-red-500 font-bold ml-2 hover:text-red-700">Remove</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 mt-2">No files chosen</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-400 mt-4">
              {loading ? "Registering..." : "Register Hospital"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalRegister;
