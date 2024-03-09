import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 8080;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  connectedUsers.push(socket.id);
  io.emit("connected-users", connectedUsers);
  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    io.to(room).emit("receive-message", message);
    // io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    connectedUsers = connectedUsers.filter((id) => id !== socket.id);
    io.emit("connected-users", connectedUsers);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
