require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// ===============================
// PORT
// ===============================

const PORT = process.env.PORT || 5000;

// ===============================
// BASIC TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("UniBus API is running...");
});

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// Driver
app.use(
  "/api/driver",
  require("./routes/driverRoutes")
);

// Buses
app.use(
  "/api/buses",
  require("./routes/busRoutes")
);

// Routes
app.use(
  "/api/routes",
  require("./routes/routeRoutes")
);

// Parents
app.use(
  "/api/parents",
  require("./routes/parentRoutes")
);

// Boarding
app.use(
  "/api/boarding",
  require("./routes/boardingRoutes")
);

// Complaints
app.use(
  "/api/complaints",
  require("./routes/complaintRoutes")
);

// Admin
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ===============================
// HTTP SERVER
// ===============================

const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL || "http://localhost:5173",
  },
});

// ===============================
// ALERT ROUTES
// IMPORTANT: io ke baad
// ===============================

app.use(
  "/api/alerts",
  require("./routes/alertRoutes")(io)
);

// ===============================
// LIVE LOCATION SOCKET
// ===============================

require("./sockets/locationSocket")(io);

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // ===============================
    // START SERVER
    // ===============================

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });