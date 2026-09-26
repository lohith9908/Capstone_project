import axios from 'axios';
import {
  IUser,
  IDataset,
  IDatasetSample,
  IExperiment,
  IDetectionResult,
  IAdversarialResult,
  IFeatureVector,
  AttackType,
  IReport,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ares_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear local storage
      localStorage.removeItem('ares_token');
      localStorage.removeItem('ares_user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data as { user: IUser; token: string };
  },
  register: async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data.data as { user: IUser; token: string };
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data as IUser;
  },
};

export const dashboardApi = {
  getMetrics: async () => {
    const res = await api.get('/dashboard');
    return res.data.data;
  },
};

export const datasetApi = {
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
};

export const experimentApi = {
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
  runCleanEvaluation: async (datasetId: string) => {
    const res = await api.post('/evaluation/clean', { datasetId });
    return res.data.data;
  },
};

export const interactiveApi = {
  analyzeDetection: async (features: IFeatureVector) => {
    const res = await api.post('/detection/analyze', { features });
    return res.data.data as IDetectionResult;
  },
  simulatePadding: async (features: IFeatureVector, options?: any) => {
    const res = await api.post('/attacks/padding', { features, options });
    return res.data.data as IAdversarialResult;
  },
  simulateGamma: async (features: IFeatureVector, options?: any) => {
    const res = await api.post('/attacks/gamma', { features, options });
    return res.data.data as IAdversarialResult;
  },
  explainInstability: async (cleanFeatures: IFeatureVector, adversarialFeatures: IFeatureVector) => {
    const res = await api.post('/explainability/analyze', { cleanFeatures, adversarialFeatures });
    return res.data.data;
  },
  compareDefenses: async (features?: IFeatureVector, attackType?: AttackType) => {
    const res = await api.post('/defenses/compare', { features, attackType });
    return res.data.data;
  },
  evaluateRobustness: async (payload: {
    experimentId?: string;
    datasetId?: string;
    features?: IFeatureVector;
    attackType?: AttackType;
    options?: any;
  }) => {
    const res = await api.post('/robustness/evaluate', payload);
    return res.data.data;
  },
  evaluateAdversarialTraining: async (features?: IFeatureVector, attackType?: AttackType, options?: any) => {
    const res = await api.post('/defenses/adversarial-training', { features, attackType, options });
    return res.data.data;
  },
  evaluateMonotonic: async (features?: IFeatureVector, attackType?: AttackType, options?: any) => {
    const res = await api.post('/defenses/monotonic', { features, attackType, options });
    return res.data.data;
  },
  getRecommendation: async (features?: IFeatureVector, attackType?: AttackType) => {
    const res = await api.post('/recommendation', { features, attackType });
    return res.data.data;
  },
  runDemo: async (attackType?: AttackType, options?: any) => {
    const res = await api.post('/demo/run', { attackType, options });
    return res.data.data;
  },
};

export const reportApi = {
  getReports: async () => {
    const res = await api.get('/reports');
    return res.data.data as IReport[];
  },
  getReportById: async (id: string) => {
    const res = await api.get(`/reports/${id}`);
    return res.data.data as IReport;
  },
  generateReport: async (experimentId: string, title?: string) => {
    const res = await api.post('/reports/generate', { experimentId, title });
    return res.data.data as IReport;
  },
};

export default api;
