import { useCallback, useEffect, useRef, useState } from "react";
import { useMessage } from "../hooks/useMessage";
import { useSocket } from "../hooks/useSocket";
import { users } from "../lib/users";
import { useAuthState } from "../store/useAuthState";
import { useUsersOp } from "../store/useUsersOp";
import { Message, User } from "../types";
import ErrorBoundary from "./ErrorBoundary";

export const ChatApp = () => {
  const { user } = useAuthState();
  const { users: allUsers = [] } = useUsersOp();
  const {
    selectedUserMessages,
    setSelectedUserMessages,
    recipient,
    setRecipient,
  } = useMessage();
  const setUsers = useUsersOp((state) => state.setUsers);
  const { socket, isConnected, isReconnecting } = useSocket();
  const [typingUsers, setTypingUsers] = useState<any>(new Set());
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !recipient) return;

      socket.emit("typing", { recipient: recipient, isTyping });
    },
    [socket, recipient]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    handleTyping(true);
    typingTimeoutRef.current = setTimeout(() => handleTyping(false), 1000);
  };

  const sendMessage = useCallback(() => {
    if (!socket || !recipient || !input.trim()) return;
    socket.emit("privateMessage", {
      recipient: recipient._id,
      content: input.trim(),
    });

    setInput("");
    handleTyping(false);
  }, [socket, recipient, input, handleTyping]);

  const fetchUsers = useCallback(async () => {
    const allUsers = await users.fetchAllUsers(user?._id);
    setUsers(allUsers);
  }, [users]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("privateMessage", (message: Message) => {});

    socket.on("userTyping", ({ username, isTyping }: any) => {
      setTypingUsers((prev: any) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(username);
        } else {
          newSet.delete(username);
        }
        return newSet;
      });
    });

    socket.on("messageDelivered", (data: any) => {
      setSelectedUserMessages((prev: Message[]) => [...prev, data._doc]);
    });

    return () => {
      socket.off("privateMessage");
      socket.off("userTyping");
      socket.off("messageDelivered");
    };
  }, [socket]);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            {isReconnecting ? "Reconnecting..." : "Disconnected"}
          </h2>
          {!isReconnecting && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white border-r">
          <h2 className="p-4 font-semibold text-slate-600">Online Users</h2>
          <ul>
            {allUsers?.map((user: User) => (
              <li
                key={user._id}
                className={`p-4 cursor-pointer text-lg text-slate-600 hover:bg-gray-50 mx-2 ${
                  recipient._id === user._id ? "bg-blue-50" : ""
                } ${
                  allUsers.indexOf(user) !== allUsers.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
                onClick={() => setRecipient(user)}
              >
                <div className="flex items-center">
                  <img
                    src={"assets/avatar.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="flex-1">{user.username}</span>
                  {!user.isOnline && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/** Chat Area */}
        <div className="flex flex-1 flex-col">
          {recipient ? (
            <>
              <div className="flex-1 p-4 overflow-auto">
                {selectedUserMessages.map((message: Message) => (
                  <div
                    key={message._id}
                    className={`mb-4 ${
                      message.socketId === socket?.id
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.socketId === socket?.id
                          ? "bg-blue-500 text-black"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString()
                        : ""}
                    </div>
                  </div>
                ))}

                {typingUsers.has(recipient) && (
                  <div className="text-gray-500 text-sm">
                    {recipient.username} is typing...
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 text-black border rounded"
                  />

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
