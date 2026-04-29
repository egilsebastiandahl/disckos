"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { EventSignup } from "@/app/types/event.model";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface EventSignupSectionProps {
  eventId: string;
  signups: EventSignup[];
  isNextEvent: boolean;
  isPastEvent: boolean;
  isMajor?: boolean;
}

export default function EventSignupSection({
  eventId,
  signups: initialSignups,
  isNextEvent,
  isPastEvent,
  isMajor = false,
}: EventSignupSectionProps) {
  const router = useRouter();
  const [signups, setSignups] = useState<EventSignup[]>(initialSignups);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session);
      if (data?.session) {
        setIsSignedUp(signups.some((s) => s.profileId === data.session?.user?.id));
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setIsSignedUp(signups.some((s) => s.profileId === newSession.user?.id));
      } else {
        setIsSignedUp(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      setIsSignedUp(signups.some((s) => s.profileId === session.user?.id));
    }
  }, [signups, session]);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;
    setLoading(true);
    try {
      const token = session.access_token;
      const res = await fetch(`/api/event/${eventId}/signup`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profile = session.user;
        setSignups((prev) => [
          ...prev,
          {
            profileId: profile.id,
            displayName: profile.user_metadata?.display_name || profile.email?.split("@")[0] || "Du",
            avatarUrl: profile.user_metadata?.avatar_url || null,
          },
        ]);
        setIsSignedUp(true);
      }
    } catch (e) {
      console.error("Signup failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;
    setLoading(true);
    try {
      const token = session.access_token;
      const res = await fetch(`/api/event/${eventId}/signup`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setSignups((prev) => prev.filter((s) => s.profileId !== session.user?.id));
        setIsSignedUp(false);
      }
    } catch (e) {
      console.error("Unsignup failed", e);
    } finally {
      setLoading(false);
    }
  };

  const showSignupAction = !isPastEvent;

  // Color helpers based on card variant
  const pillBg = isMajor
    ? "bg-warm-foreground/15 hover:bg-warm-foreground/25"
    : isNextEvent
      ? "bg-primary-foreground/15 hover:bg-primary-foreground/25"
      : "bg-muted/80 hover:bg-muted";
  const pillText = isMajor ? "text-warm-foreground" : isNextEvent ? "text-primary-foreground" : "text-foreground";
  const pillBorder = isMajor
    ? "border-warm-foreground/25"
    : isNextEvent
      ? "border-primary-foreground/25"
      : "border-border";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Signup/action pill */}
      {showSignupAction && (
        <>
          {session ? (
            isSignedUp ? (
              <button
                onClick={handleUnsignup}
                disabled={loading}
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition cursor-pointer disabled:opacity-50 ${pillBorder} ${pillText} ${pillBg}`}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                <span>{loading ? "..." : "Påmeldt"}</span>
              </button>
            ) : (
              <button
                onClick={handleSignup}
                disabled={loading}
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 ${
                  isMajor
                    ? "bg-warm-foreground text-warm hover:bg-warm-foreground/90"
                    : isNextEvent
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <PersonIcon sx={{ fontSize: 16 }} />
                <span>{loading ? "..." : "Meld på"}</span>
              </button>
            )
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/signup");
              }}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition cursor-pointer ${pillBorder} ${pillText} ${pillBg}`}
            >
              <PersonIcon sx={{ fontSize: 16 }} />
              <span>Registrer deg</span>
            </button>
          )}
        </>
      )}

      {/* Attendee count pill that opens drawer */}
      {signups.length > 0 && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrawerOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition cursor-pointer ${pillBorder} ${pillText} ${pillBg}`}
            >
              <PersonIcon sx={{ fontSize: 14 }} />
              <span>
                {signups.length} påmeldt{signups.length !== 1 ? "e" : ""}
              </span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Påmeldte</DrawerTitle>
              <DrawerDescription>
                {signups.length} deltaker{signups.length !== 1 ? "e" : ""} har meldt seg på dette eventet
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6 max-h-[50vh] overflow-y-auto">
              <ul className="space-y-3">
                {signups.map((signup) => (
                  <li key={signup.profileId} className="flex items-center gap-3">
                    <AttendeeAvatar signup={signup} />
                    <span className="text-sm font-medium text-foreground">{signup.displayName || "Ukjent bruker"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 pb-4">
              <DrawerClose asChild>
                <button className="w-full py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition cursor-pointer">
                  Lukk
                </button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function AttendeeAvatar({ signup }: { signup: EventSignup }) {
  const initials = getInitials(signup.displayName);

  if (signup.avatarUrl) {
    return (
      <img
        src={signup.avatarUrl}
        alt={signup.displayName || "Bruker"}
        className="w-9 h-9 rounded-full object-cover border border-border"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-primary/15 text-primary border border-border">
      {initials}
    </div>
  );
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
