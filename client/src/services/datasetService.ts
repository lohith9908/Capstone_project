import api from './api';
import { IDataset, IDatasetSample } from '../types';

export const datasetService = {
  getDatasets: async () => {
    const res = await api.get('/datasets');
    return res.data.data as IDataset[];
  },
  getDatasetById: async (id: string) => {
    const res = await api.get(`/datasets/${id}`);
    return res.data.data as { dataset: IDataset; statistics: any };
  },
  getSamples: async (id: string, page = 1, limit = 20, label?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (label) params.append('label', label);
    const res = await api.get(`/datasets/${id}/samples?${params.toString()}`);
    return res.data.data as { samples: IDatasetSample[]; pagination: any };
  },
  uploadCsv: async (name: string, description: string, csvContent: string) => {
    const res = await api.post('/datasets/upload-csv', { name, description, csvContent });
    return res.data.data as IDataset;
  },
  createDataset: async (datasetData: Partial<IDataset>) => {
    const res = await api.post('/datasets', datasetData);
    return res.data.data as IDataset;
  },
};

export default datasetService;
