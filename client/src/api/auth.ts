import api from '../lib/axios';
import type { User, SingleResponse } from '../types';

export const loginFn = async (data: any): Promise<{ token: string; data: { user: User } }> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const registerFn = async (data: any): Promise<{ token: string; data: { user: User } }> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logoutFn = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMeFn = async (): Promise<SingleResponse<{ user: User }>> => {
  const response = await api.get('/auth/me');
  return response.data;
};
