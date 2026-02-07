import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUI from "./AdminUI";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/admin");

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-2">
        Welcome, {session.user?.name ?? session.user?.email}
      </p>
      <div className="mt-6">
        <AdminUI />
      </div>
    </main>
  );
}
