"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";
import type { AppNotification } from "@/types";

const SocketContext = createContext<null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const connectedRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    if (user) {
      if (!connectedRef.current) {
        socket.connect();
        connectedRef.current = true;
      }
      socket.emit("join", user._id);
    }

    function handleNotification(notification: AppNotification) {
      toast(notification.title, { description: notification.message });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user, queryClient]);

  useEffect(() => {
    if (!user && connectedRef.current) {
      getSocket().disconnect();
      connectedRef.current = false;
    }
  }, [user]);

  return <SocketContext.Provider value={null}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
