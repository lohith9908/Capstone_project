import api from './api';
import { IExperiment, AttackType } from '../types';

export const experimentService = {
  getExperiments: async () => {
    const res = await api.get('/experiments');
    return res.data.data as IExperiment[];
  },
  getExperimentById: async (id: string) => {
    const res = await api.get(`/experiments/${id}`);
    return res.data.data as IExperiment;
  },
  getExperimentResults: async (id: string) => {
    const res = await api.get(`/experiments/${id}/results`);
    return res.data.data;
  },
  runExperiment: async (payload: {
    name: string;
    datasetId: string;
    attackType: AttackType;
    options?: any;
  }) => {
    const res = await api.post('/experiments/run', payload);
    return res.data.data as IExperiment;
  },
  runDemo: async (attackType?: AttackType, options?: any) => {
    const res = await api.post('/demo/run', { attackType, options });
    return res.data.data;
  },
};

export default experimentService;
