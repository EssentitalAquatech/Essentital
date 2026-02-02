import React from "react";

function SatelliteDashboard() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Admin Satellite Dashboard"
        // src="https://d2o70d6w5dqxje.cloudfront.net/"
        src="https://essential-aquatech-satellite-dashboard.onrender.com"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="geolocation"
        allowFullScreen
      />
    </div>
  );
}

export default SatelliteDashboard;