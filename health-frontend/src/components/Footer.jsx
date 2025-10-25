import React from "react";

const Footer = () => {
  return (
    <footer className="bg-emerald-500 text-white text-center py-4 mt-8">
      &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
    </footer>
  );
};

export default Footer;
