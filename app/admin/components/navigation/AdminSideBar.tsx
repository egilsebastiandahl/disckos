"use client";

import { sideBarNavigationData } from "@/app/admin/data/side-bar-navigation.data";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSideBar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 self-start w-64 shrink-0">
      <nav className="flex flex-col gap-1 rounded-xl bg-sidebar border border-sidebar-border p-3 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 pt-1 pb-3 mb-1 border-b border-sidebar-border">
          <Shield className="h-5 w-5 text-warm" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-sidebar-foreground/70">Admin</h2>
        </div>

        {/* Nav links */}
        {sideBarNavigationData.map((item) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-150 ease-in-out
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
            >
              <item.icon
                className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                  isActive ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-warm"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
