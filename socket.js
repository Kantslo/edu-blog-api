import { Server } from "socket.io";

let io;

export function init(httpServer) {
  io = new Server(httpServer);
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}
