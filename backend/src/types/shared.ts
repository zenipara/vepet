export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  stock_qty?: number;
  is_active?: boolean;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}
