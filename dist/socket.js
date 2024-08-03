"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configureSocket(io) {
    io.on("connection", (socket) => {
        console.log("a user connected" + socket.id);
    });
    io.on("disconnect", (socket) => {
        console.log("user disconnected" + socket.id);
    });
}
exports.default = configureSocket;
