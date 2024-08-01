import { Server } from "socket.io";

function configureSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  io.on("disconnect", (socket) => {
    console.log("user disconnected");
  });
}

export default configureSocket;
