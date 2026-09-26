import { useState, useEffect } from 'react';
import { experimentService } from '../services/experimentService';
import { IExperiment } from '../types';

export const useExperiment = () => {
  const [experiments, setExperiments] = useState<IExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExperiments = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await experimentService.getExperiments();
      setExperiments(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load experiments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  return { experiments, loading, error, refresh: loadExperiments };
};
