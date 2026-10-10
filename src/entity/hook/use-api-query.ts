"use client";

import { useEffect, useRef, useState } from "react";

import { type ApiError, toApiError } from "../api";

type QueryState<T> = { key: string; data?: T; error?: ApiError };

// Fetches `fetcher()` whenever `key` changes; results for stale keys are ignored.
export function useApiQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [state, setState] = useState<QueryState<T> | null>(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let active = true;
    fetcherRef.current().then(
      (data) => active && setState({ key, data }),
      (error: unknown) => active && setState({ key, error: toApiError(error) }),
    );
    return () => {
      active = false;
    };
  }, [key]);

  const current = state?.key === key ? state : null;
  return { data: current?.data, error: current?.error, loading: !current };
}
