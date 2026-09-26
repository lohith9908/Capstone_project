import api from './api';
import { IReport } from '../types';

export const reportService = {
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

export default reportService;
