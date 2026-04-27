import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const useAdminFetch = <T>(url: string) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(url, {
          signal,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setError(undefined);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [url]);

  return { data, isLoading, error };
};

export default useAdminFetch;
