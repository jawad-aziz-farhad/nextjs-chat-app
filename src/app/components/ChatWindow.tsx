"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export const ChatWindow = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room] = useState("public");

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", room);

      socket.on("newMessage", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, room]);

  const sendMessage = (content: string) => {
    if (socket) {
      socket.emit("sendMessage", { content, room });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
