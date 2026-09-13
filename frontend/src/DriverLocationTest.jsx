import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function DriverLocationTest() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    // Socket connected
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setStatus("Connected");
    });

    // Socket error
    socket.on("connect_error", (error) => {
      console.error("❌ Socket error:", error.message);
      setStatus("Connection Error");
    });

    // Get driver's GPS location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("📍 Driver GPS:", lat, lng);

        setLocation({
          lat,
          lng,
        });

        // Send location to backend
        socket.emit("updateLocation", {
          busId: "BUS001",
          lat,
          lng,
        });

        console.log("📡 Location sent to server");
      },
      (error) => {
        console.error("❌ GPS Error:", error.message);
        setStatus("GPS Error");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);

      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Driver Location Test</h1>

      <h3>Status: {status}</h3>

      {location ? (
        <div>
          <p>
            <strong>Latitude:</strong> {location.lat}
          </p>

          <p>
            <strong>Longitude:</strong> {location.lng}
          </p>
        </div>
      ) : (
        <p>Getting GPS location...</p>
      )}
    </div>
  );
}

export default DriverLocationTest;