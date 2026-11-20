import { useState, useEffect } from "react";
import client from "../api/axiosInstance.js";

export function useFetch(url, params) {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== "" && v != null),
  );
  const key = url ? JSON.stringify([url, clean]) : null;

  const [state, setState] = useState({ key: null, data: null, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!key) return;
    const [requestUrl, requestParams] = JSON.parse(key);
    let cancelled = false;

    client
      .get(requestUrl, { params: requestParams })
      .then(({ data }) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            key,
            data: null,
            error: err.response?.data?.message || err.message,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key, tick]);

  const ready = key !== null && state.key === key;
  return {
    data: ready ? state.data : null,
    error: ready ? state.error : null,
    loading: key !== null && !ready,
    reload: () => setTick((t) => t + 1),
  };
}
