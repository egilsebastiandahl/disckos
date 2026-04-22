"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data?.session;
      setSession(sess);
      if (sess) {
        const token = sess.access_token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
        try {
          const res = await fetch(`${backendUrl}/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const json = await res.json();
            setProfile(json);
          }
        } catch (e) {
          console.warn("Failed fetching profile", e);
        }
      }
    };
    s();
  }, []);

  useEffect(() => {
    function onDoc(e: any) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = profile?.displayName
    ? profile.displayName
        .split(" ")
        .map((s: string) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (session?.user?.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative ml-4" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <div className="p-2">
            <div className="text-sm font-medium">{profile?.displayName ?? session?.user?.email}</div>
            <div className="text-xs text-gray-500">@{profile?.username ?? "user"}</div>
          </div>
          <div className="border-t" />
          <Link href="/pages/profile" className="block px-3 py-2 text-sm hover:bg-gray-100">
            Your profile
          </Link>
          {(!profile?.username || !profile?.displayName) && (
            <Link href="/pages/profile" className="block px-3 py-2 text-sm text-indigo-600 hover:bg-gray-100">
              Complete profile
            </Link>
          )}
          <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
