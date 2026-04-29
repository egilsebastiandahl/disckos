"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminSideBar from "./components/navigation/AdminSideBar";

interface AdminLayout {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayout) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile.isAdmin) {
            setAuthorized(true);
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Laster...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex gap-8 px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
      <AdminSideBar />
      <main className="flex-1 max-w-3xl space-y-8">{children}</main>
    </div>
  );
}
