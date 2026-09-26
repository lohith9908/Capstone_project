import { useState, useEffect } from 'react';
import { datasetService } from '../services/datasetService';
import { IDataset } from '../types';

export const useDataset = () => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await datasetService.getDatasets();
      setDatasets(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  return { datasets, loading, error, refresh: loadDatasets };
};
