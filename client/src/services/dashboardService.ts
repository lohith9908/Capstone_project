import api from './api';

export const dashboardService = {
  getMetrics: async () => {
    const res = await api.get('/dashboard');
    return res.data.data;
  },
};

export default dashboardService;
