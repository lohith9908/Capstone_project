import api from './api';
import { IFeatureVector, IAdversarialResult } from '../types';

export const attackService = {
  simulatePadding: async (features: IFeatureVector, options?: any) => {
    const res = await api.post('/attacks/padding', { features, options });
    return res.data.data as IAdversarialResult;
  },
  simulateGamma: async (features: IFeatureVector, options?: any) => {
    const res = await api.post('/attacks/gamma', { features, options });
    return res.data.data as IAdversarialResult;
  },
};

export default attackService;
