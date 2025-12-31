import axios from 'axios';
import type { ActionsListResponse } from '../types';
import { useAuthStore } from '../store/authStore';

// Instancia de axios
const api = axios.create({
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// GET: Listado
export const getActions = async (page: number = 1, pageSize: number = 10): Promise<ActionsListResponse> => {
  const response = await api.get<ActionsListResponse>(
    `https://dev.api.bekindnetwork.com/api/v1/actions/admin-list?pageNumber=${page}&pageSize=${pageSize}`
  );
  return response.data; 
};

// POST: Crear 
export const createAction = async (data: FormData): Promise<void> => {
  await api.post(
    'https://dev.api.bekindnetwork.com/api/v1/actions/admin-add', 
    data
  );
};

// DELETE: Eliminar
export const deleteAction = async (id: string | number): Promise<void> => {
  await api.delete(`https://dev.api.bekindnetwork.com/api/v1/actions/${id}`); 
};