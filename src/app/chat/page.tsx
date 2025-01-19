"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatApp } from "../components/ChatApp";
import { useAuthState } from "../store/useAuthState";

const ChatPage = () => {
  const { token, user, logout } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  if (!token || !user) {
    return (
      <Link href={"/auth/lgoin"} className="text-blue-400 hover:text-blue-600">
        Go to Login
      </Link>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl text-slate-600 font-semibold">Chat App</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl text-slate-600 font-semibold">
              Welcome, {user.username}
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* <ChatWindow /> */}
        <ChatApp />
      </main>
    </div>
  );
};

export default ChatPage;
