import api from './api';
import { IFeatureVector } from '../types';

export const explainabilityService = {
  analyzeInstability: async (cleanFeatures: IFeatureVector, adversarialFeatures: IFeatureVector) => {
    const res = await api.post('/explainability/analyze', { cleanFeatures, adversarialFeatures });
    return res.data.data;
  },
};

export default explainabilityService;
