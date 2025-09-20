import React from "react";

// Temporary dummy data for now
const dummyAlerts = [
  { origin: "JFK", destination: "LAX", price: 200 },
  { origin: "SFO", destination: "ORD", price: 150 },
];

const AlertList: React.FC = () => {
  return (
    <div>
      <h3>Your Flight Alerts</h3>
      {dummyAlerts.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        <ul>
          {dummyAlerts.map((alert, index) => (
            <li key={index}>
              {alert.origin} → {alert.destination} | ${alert.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertList;
