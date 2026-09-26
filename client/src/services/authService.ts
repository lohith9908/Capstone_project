import api from './api';
import { IUser } from '../types';

export const authService = {
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

export default authService;
