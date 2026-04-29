"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { EventSignup } from "@/app/types/event.model";

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

  // Don't show signup action for past events
  const showSignupAction = !isPastEvent;

  return (
    <div className="mt-4">
      {/* Attendee badges */}
      {signups.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className={`text-sm font-medium ${
              isMajor ? "text-warm-foreground/80" : isNextEvent ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            Påmeldte ({signups.length}):
          </span>
          <div className="flex -space-x-2">
            {signups.slice(0, 8).map((signup) => (
              <SignupAvatar key={signup.profileId} signup={signup} isNextEvent={isNextEvent} isMajor={isMajor} />
            ))}
            {signups.length > 8 && (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isMajor
                    ? "bg-warm-foreground/20 border-warm-foreground/40 text-warm-foreground"
                    : isNextEvent
                      ? "bg-primary-foreground/20 border-primary-foreground/40 text-primary-foreground"
                      : "bg-muted border-border text-muted-foreground"
                }`}
              >
                +{signups.length - 8}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signup action */}
      {showSignupAction && (
        <div>
          {session ? (
            isSignedUp ? (
              <button
                onClick={handleUnsignup}
                disabled={loading}
                className={`text-sm px-4 py-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${
                  isMajor
                    ? "border-warm-foreground/40 text-warm-foreground hover:bg-warm-foreground/10"
                    : isNextEvent
                      ? "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                      : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {loading ? "..." : "Meld av"}
              </button>
            ) : (
              <button
                onClick={handleSignup}
                disabled={loading}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 ${
                  isMajor
                    ? "bg-warm-foreground text-warm hover:bg-warm-foreground/90"
                    : isNextEvent
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {loading ? "..." : "Meld på"}
              </button>
            )
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/signup");
              }}
              className={`text-sm px-4 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                isMajor
                  ? "bg-warm-foreground/15 text-warm-foreground hover:bg-warm-foreground/25 border border-warm-foreground/30"
                  : isNextEvent
                    ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border border-primary-foreground/30"
                    : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
              }`}
            >
              Registrer deg for å melde på
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SignupAvatar({
  signup,
  isNextEvent,
  isMajor,
}: {
  signup: EventSignup;
  isNextEvent: boolean;
  isMajor: boolean;
}) {
  const initials = getInitials(signup.displayName);

  if (signup.avatarUrl) {
    return (
      <img
        src={signup.avatarUrl}
        alt={signup.displayName || "Bruker"}
        title={signup.displayName || "Bruker"}
        className={`w-8 h-8 rounded-full border-2 object-cover ${
          isMajor ? "border-warm-foreground/40" : isNextEvent ? "border-primary" : "border-card"
        }`}
      />
    );
  }

  return (
    <div
      title={signup.displayName || "Bruker"}
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
        isMajor
          ? "bg-warm-foreground/30 border-warm-foreground/40 text-warm-foreground"
          : isNextEvent
            ? "bg-primary-foreground/30 border-primary text-primary-foreground"
            : "bg-primary/15 border-card text-primary"
      }`}
    >
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
