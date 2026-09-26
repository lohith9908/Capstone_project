import api from './api';
import { IFeatureVector, AttackType, IDefenseEvaluationResult } from '../types';

export const defenseService = {
  evaluateAdversarialTraining: async (features?: IFeatureVector, attackType?: AttackType, options?: any) => {
    const res = await api.post('/defenses/adversarial-training', { features, attackType, options });
    return res.data.data as IDefenseEvaluationResult;
  },
  evaluateMonotonic: async (features?: IFeatureVector, attackType?: AttackType, options?: any) => {
    const res = await api.post('/defenses/monotonic', { features, attackType, options });
    return res.data.data as IDefenseEvaluationResult;
  },
  compareDefenses: async (features?: IFeatureVector, attackType?: AttackType) => {
    const res = await api.post('/defenses/compare', { features, attackType });
    return res.data.data as { defenses: IDefenseEvaluationResult[]; recommendation: any };
  },
};

export default defenseService;
