"use client";

import { useEffect, useRef } from "react";
import { sideBarNavigationData } from "@/app/admin/data/side-bar-navigation.data";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Admin navigation: a horizontal tab bar on phones, a sticky sidebar from md and up. */
export default function AdminSideBar() {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // On phones the tab bar scrolls sideways; keep the current page's tab in view.
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <>
      <nav aria-label="Admin" className="-mx-4 overflow-x-auto px-4 md:hidden">
        <ul className="flex w-max gap-2 pb-1">
          {sideBarNavigationData.map((item) => {
            const isActive = pathname.startsWith(item.url);
            return (
              <li key={item.url}>
                <Link
                  ref={isActive ? activeTabRef : undefined}
                  href={item.url}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-sidebar-border bg-sidebar text-sidebar-foreground/80"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className="sticky top-24 hidden w-64 shrink-0 self-start md:block">
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
                aria-current={isActive ? "page" : undefined}
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
    </>
  );
}
