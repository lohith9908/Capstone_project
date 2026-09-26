import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getMetrics();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { data, loading, error, refresh: fetchMetrics };
};
