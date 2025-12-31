import axios from 'axios';
import type { LoginRequest, AuthResponse } from '../types';
// Instancia de axios 
const api = axios.create({
  headers: { 'Content-Type': 'application/json' }
});

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    'https://dev.apinetbo.bekindnetwork.com/api/Authentication/Login', 
    credentials
  );
  return response.data;
};