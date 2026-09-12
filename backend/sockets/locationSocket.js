const Bus = require("../models/Bus");

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log(
      "🔌 New client connected:",
      socket.id
    );

    // Student/parent watches a bus
    socket.on(
      "joinBusRoom",
      (busId) => {
        socket.join(
          `bus_${busId}`
        );
      }
    );

    // Driver sends GPS location
    socket.on(
      "updateLocation",
      async ({
        busId,
        lat,
        lng,
      }) => {

        await Bus.findOneAndUpdate(
          { busId },

          {
            currentLocation: {
              lat,
              lng,
              updatedAt:
                new Date(),
            },

            status: "active",
          }
        );

        io.to(
          `bus_${busId}`
        ).emit(
          "locationUpdate",
          {
            busId,
            lat,
            lng,
          }
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "❌ Client disconnected:",
          socket.id
        );
      }
    );

  });
};