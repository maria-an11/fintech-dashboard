// Matching backend API

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: null | string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: null | string;
  transaction_date: string;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_color: string;
  total: number;
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "amount" | "created_at";
  sortOrder?: "asc" | "desc";
}
