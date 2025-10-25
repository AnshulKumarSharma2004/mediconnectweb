import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-emerald-500 text-white px-8 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">MediConnect</div>
      <div className="space-x-4">
        <Link to="/">
          <button className="hover:bg-emerald-400 px-4 py-2 rounded">Home</button>
        </Link>
        <Link to="/login">
          <button className="hover:bg-emerald-400 px-4 py-2 rounded">
            Login / Signup
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
