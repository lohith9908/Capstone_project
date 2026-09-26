import api from './api';
import { IFeatureVector, IDetectionResult } from '../types';

export const detectionService = {
  analyze: async (features: IFeatureVector) => {
    const res = await api.post('/detection/analyze', { features });
    return res.data.data as IDetectionResult;
  },
};

export default detectionService;
