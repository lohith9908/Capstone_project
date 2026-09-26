import api from './api';
import { IFeatureVector, AttackType, IRecommendationResult } from '../types';

export const recommendationService = {
  getRecommendation: async (features?: IFeatureVector, attackType?: AttackType) => {
    const res = await api.post('/recommendation', { features, attackType });
    return res.data.data as IRecommendationResult;
  },
};

export default recommendationService;
