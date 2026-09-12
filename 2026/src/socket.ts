import { io, Socket } from "socket.io-client";
import { isArchiveMode } from "./archive/archive";

let socketUrl = import.meta.env.VITE_API_URL || "/";
if (socketUrl.endsWith("/api")) {
  socketUrl = socketUrl.replace(/\/api$/, "");
}

export const socket: Socket = io(socketUrl, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: !isArchiveMode,
});
