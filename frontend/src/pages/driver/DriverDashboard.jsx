import { useEffect, useState } from "react";
import socket from "../../services/socket";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function DriverDashboard() {
  const { user } = useAuth();

  const [sharing, setSharing] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("delay");

  useEffect(() => {
    let watchId;

    if (sharing) {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        setSharing(false);
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit("updateLocation", {
            busId: user.busId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          alert("Unable to access your location.");
          setSharing(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
        }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [sharing, user.busId]);

  const sendAlert = async () => {
    if (!alertMsg.trim()) {
      alert("Please describe the situation.");
      return;
    }

    try {
      await api.post("/alerts", {
        busId: user.busId,
        type: alertType,
        message: alertMsg,
      });

      setAlertMsg("");

      alert("Alert sent to all students & parents on this bus!");
    } catch (error) {
      console.error("Failed to send alert:", error);
      alert(
        error.response?.data?.message ||
          "Failed to send alert. Please try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Driver Dashboard — Bus {user.busId}
      </h1>

      {/* Location Sharing */}
      <button
        onClick={() => setSharing((prev) => !prev)}
        className={`w-full py-3 rounded text-white ${
          sharing ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {sharing
          ? "Stop Sharing Location"
          : "Start Trip / Share Location"}
      </button>

      {/* Alerts */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="font-bold">
          Report Traffic / Emergency
        </h3>

        <select
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="traffic">Traffic</option>
          <option value="accident">Accident</option>
          <option value="delay">Delay</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Describe the situation..."
          className="w-full border p-2 rounded"
          value={alertMsg}
          onChange={(e) => setAlertMsg(e.target.value)}
          rows={4}
        />

        <button
          onClick={sendAlert}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Send Alert
        </button>
      </div>
    </div>
  );
}
