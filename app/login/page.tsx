"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (res.error) {
        setMessage(res.error.message);
        return;
      }
      setMessage("Logged in successfully");
      // ensure backend has profile and redirect new users to /profile to complete setup
      try {
        const session = res.data?.session;
        const token = session?.access_token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
        if (token) {
          const profileRes = await fetch(`${backendUrl}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            if (!profile.username || !profile.displayName) {
              router.push("/profile");
              return;
            }
          }
        }
      } catch (e) {
        // ignore and continue to home
      }
      router.push("/");
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.message ?? "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Sign in to Disckos</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Enter your email and password to continue.</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-red-600">{message}</div>}

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
