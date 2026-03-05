/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const abortController = new AbortController(); // Used for cleanup
        const signal = abortController.signal;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(url, { signal });
                if (!res.ok) {
                    // handles server error responses, like 404
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const json = await res.json();
                setData(json);
                setError(undefined);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(err.message);
                    setData(undefined);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Cleanup function to abort fetch when component unmounts
        return () => abortController.abort();
    }, [url]); // Dependency array: re-run hook if URL changes

    // Return the states to the component
    return { data, isLoading, error };
};

export default useFetch;
