import { useState } from "react";

export function useAsyncClick<T extends (...args: any[]) => Promise<any>>(fn: T) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (...args: Parameters<T>) => {
    if (loading) return;
    setLoading(true);
    try {
      await fn(...args);
    } finally {
      setLoading(false);
    }
  };

  return { handleClick, loading };
}
