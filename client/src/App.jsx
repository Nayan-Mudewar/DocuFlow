// Updated App.jsx with routing and auth pages
import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateDocument from "./pages/CreateDocument";
import Navbar from "./Components/Navbar";
import EditDocument from "./pages/EditDocument";
const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar/>}
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/create" element={token ? <CreateDocument /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={token ? <EditDocument/> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App; 
