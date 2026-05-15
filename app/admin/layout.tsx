"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import AdminSideBar from "./components/navigation/AdminSideBar";

interface AdminLayout {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayout) {
  const router = useRouter();
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
    } else if (profile && !profile.isAdmin) {
      router.replace("/");
    }
  }, [loading, session, profile, router]);

  if (loading || !session || !profile?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Laster...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
      <AdminSideBar />
      <main className="flex-1 max-w-3xl space-y-8">{children}</main>
    </div>
  );
}
