
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  [key: string]: any; 
}

export interface Action {
  id: string | number;
  name: string;
  description: string;
  status: string;
  creationDate: string;
  imageUrl?: string;
}

export interface ActionsListResponse {
  data?: {
    data?: Action[];         
    pageNumber?: number;
    pageSize?: number;
    totalElements?: number;    
    totalPages?: number;       
  };
}