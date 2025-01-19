"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { auth } from "../lib/auth";
import { useAuthState } from "../store/useAuthState";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const setAuth = useAuthState((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        token,
        user: { username, _id },
      } = await auth.signIn({ email, password });

      setAuth(token, { _id, username, email });
      router.push("/chat");
    } catch (error) {
      setError("Invalid Credentials");
    }
  };

  return (
    <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
      {/** Email */}
      <div>
        <label className="block text-sm  font-medium mb-1">Email</label>
        <input
          type="text"
          value={email}
          className="w-full p-2 border rounded text-slate-600"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/** Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          className="w-full p-2 border rounded text-slate-600"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};
