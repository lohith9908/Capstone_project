import api from './api';
import { IFeatureVector, AttackType, IRobustnessEvaluationResult } from '../types';

export const robustnessService = {
  evaluate: async (payload: {
    experimentId?: string;
    datasetId?: string;
    features?: IFeatureVector;
    attackType?: AttackType;
    options?: any;
  }) => {
    const res = await api.post('/robustness/evaluate', payload);
    return res.data.data as IRobustnessEvaluationResult;
  },
  getByExperimentId: async (experimentId: string) => {
    const res = await api.get(`/robustness/${experimentId}`);
    return res.data.data;
  },
};

export default robustnessService;
