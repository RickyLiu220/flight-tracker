import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/signup" element={<Signup />} />
        {/* Signup page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
