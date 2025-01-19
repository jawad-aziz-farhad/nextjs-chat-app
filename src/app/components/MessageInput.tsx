import React, { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}
export const MessageInput = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setTimeout(() => setMessage(""), 1000);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="flex-1 p-2 border rounded text-slate-700"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </form>
  );
};
