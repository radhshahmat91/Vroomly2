import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

/** One shared socket connection for the whole app, created lazily on first use. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}
