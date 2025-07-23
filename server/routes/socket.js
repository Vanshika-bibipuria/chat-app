let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log("⚡ A user connected");

      socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected");
      });
    });

    return io;
  }
};
