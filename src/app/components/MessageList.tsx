import { useAuthState } from "../store/useAuthState";
import { Message } from "../types";

interface Props {
  messages: Message[];
}

export const MessageList = ({ messages }: Props) => {
  const { user } = useAuthState();
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message: Message) => (
        <div
          key={message._id}
          className={`flex ${
            message.sender.email === user?.email
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`min-w-[50%] max-x-[70%] rounded-lg p-3 ${
              message.sender.email === user?.email
                ? "bg-blue-300 text-white"
                : "bg-green-500"
            }`}
          >
            <p className="text-sm text-slate-600 font-medium">
              {message.sender.username}
            </p>
            <p className="text-[16px] text-slate-800 font-medium ">
              {message.content}
            </p>
            <p className="text-xs text-slate-600 opacity-70">
              {new Date(message.createdAt ?? "").toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
