import React from "react";
import AlertForm from "../components/AlertForm";
import AlertList from "../components/AlertList";

const Dashboard: React.FC = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome! Here you can create and view your flight alerts.</p>

      {/* Form to create a new alert */}
      <AlertForm />

      {/* List of existing alerts */}
      <AlertList />
    </div>
  );
};

export default Dashboard;
