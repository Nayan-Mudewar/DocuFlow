import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="font-bold text-xl">DocuFlow</div>
      <div className="flex gap-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/create" className="text-blue-600 hover:underline">Create</Link>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
