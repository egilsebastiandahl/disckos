"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/app/types/profile.model";

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<Profile | null>;
  mutateProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfileWithToken(token: string): Promise<Profile | null> {
  try {
    const res = await fetch(`/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as Profile;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef<Promise<Profile | null> | null>(null);

  const loadProfile = useCallback((token: string | undefined | null) => {
    if (!token) {
      setProfile(null);
      inFlight.current = null;
      return Promise.resolve(null);
    }
    if (inFlight.current) return inFlight.current;
    const promise = fetchProfileWithToken(token).then((p) => {
      setProfile(p);
      return p;
    });
    inFlight.current = promise;
    promise.finally(() => {
      if (inFlight.current === promise) inFlight.current = null;
    });
    return promise;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return loadProfile(data?.session?.access_token);
  }, [loadProfile]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const sess = data?.session ?? null;
      setSession(sess);
      setLoading(false);
      if (sess) await loadProfile(sess.access_token);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_IN") {
        setSession(newSession);
        loadProfile(newSession?.access_token);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setProfile(null);
      } else if (event === "TOKEN_REFRESHED") {
        setSession(newSession);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const mutateProfile = useCallback((p: Profile | null) => {
    setProfile(p);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        refreshProfile,
        mutateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
