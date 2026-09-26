import api from './api';

export const evaluationService = {
  runCleanEvaluation: async (datasetId: string) => {
    const res = await api.post('/evaluation/clean', { datasetId });
    return res.data.data;
  },
};

export default evaluationService;
