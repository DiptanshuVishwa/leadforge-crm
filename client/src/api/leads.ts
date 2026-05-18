import api from '../lib/axios';
import type { Lead, PaginatedResponse, SingleResponse } from '../types';

export const getLeadsFn = async (params: any): Promise<PaginatedResponse<Lead>> => {
  const response = await api.get('/leads', { params });
  return response.data;
};

export const getLeadFn = async (id: string): Promise<SingleResponse<Lead>> => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const createLeadFn = async (data: any): Promise<SingleResponse<Lead>> => {
  const response = await api.post('/leads', data);
  return response.data;
};

export const updateLeadFn = async ({ id, data }: { id: string; data: any }): Promise<SingleResponse<Lead>> => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};

export const deleteLeadFn = async (id: string) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

export const exportLeadsCsvFn = async (params: any) => {
  const response = await api.get('/leads/export/csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
