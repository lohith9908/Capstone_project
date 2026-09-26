import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';

export const useMetrics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getMetrics();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load telemetry metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { data, loading, error, refresh: fetchMetrics };
};
