import { Server } from "socket.io";

function configureSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected" + socket.id);
  });

  io.on("disconnect", (socket) => {
    console.log("user disconnected" + socket.id);
  });
}

export default configureSocket;
