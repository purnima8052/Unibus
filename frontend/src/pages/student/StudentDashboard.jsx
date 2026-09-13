import { useState, useEffect } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import MapView from "../../components/MapView";

export default function StudentDashboard() {
  const [query, setQuery] = useState("");
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [alerts, setAlerts] = useState([]);

  const searchBus = async () => {
    try {
      const res = await api.get(
        `/buses/search?query=${encodeURIComponent(query)}`
      );
      setBuses(res.data);
    } catch (error) {
      console.error("Failed to search buses:", error);
    }
  };

  const trackBus = (bus) => {
    setSelectedBus(bus);
    setLocation({ lat: null, lng: null });

    socket.emit("joinBusRoom", bus.busId);
  };

  useEffect(() => {
    const handleLocationUpdate = (data) => {
      if (selectedBus && data.busId === selectedBus.busId) {
        setLocation({
          lat: data.lat,
          lng: data.lng,
        });
      }
    };

    const handleNewAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    };

    socket.on("locationUpdate", handleLocationUpdate);
    socket.on("newAlert", handleNewAlert);

    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("newAlert", handleNewAlert);
    };
  }, [selectedBus]);

  const checkIn = async (manualStatus) => {
    if (!selectedBus) {
      alert("Please select a bus first.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post("/boarding/check-in", {
            busId: selectedBus.busId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            manualStatus,
          });

          alert("Status updated!");
        } catch (error) {
          console.error("Check-in failed:", error);
          alert("Failed to update status.");
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to get your location.");
      }
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search Bus ID or Route..."
          className="border p-2 rounded flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchBus();
            }
          }}
        />

        <button
          onClick={searchBus}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Bus Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {buses.map((bus) => (
          <div
            key={bus._id}
            onClick={() => trackBus(bus)}
            className={`border p-3 rounded cursor-pointer hover:bg-blue-50 ${
              selectedBus?.busId === bus.busId
                ? "border-blue-600 bg-blue-50"
                : ""
            }`}
          >
            <p className="font-bold">{bus.busId}</p>
            <p className="text-sm">
              {bus.route?.routeName || "No route assigned"}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Bus */}
      {selectedBus && (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Tracking Bus: {selectedBus.busId}
            </h2>

            {location.lat !== null && location.lng !== null ? (
              <MapView
                lat={location.lat}
                lng={location.lng}
                label={selectedBus.busId}
              />
            ) : (
              <div className="border rounded p-6 text-center text-gray-500">
                Waiting for bus location...
              </div>
            )}
          </div>

          {/* Boarding Status */}
          <div className="flex gap-3">
            <button
              onClick={() => checkIn("onboard")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              I'm on the bus
            </button>

            <button
              onClick={() => checkIn("not_onboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Not on the bus
            </button>
          </div>
        </>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
          <h3 className="font-bold mb-2">Live Alerts</h3>

          {alerts.map((a, i) => (
            <p key={i} className="text-sm">
              [ALERT] [{a.type}] {a.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
