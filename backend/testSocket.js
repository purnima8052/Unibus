const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server");
  console.log("Socket ID:", socket.id);

  socket.emit("joinBusRoom", "BUS001");

  console.log("🚌 Joined BUS001 room");

  socket.emit("updateLocation", {
    busId: "BUS001",
    lat: 26.8467,
    lng: 80.9462,
  });

  console.log("📍 Location sent");
});

socket.on("locationUpdate", (data) => {
  console.log("📡 Location update received:");
  console.log(data);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection error:");
  console.log(error.message);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:");
  console.log(reason);
});