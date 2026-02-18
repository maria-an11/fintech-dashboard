import type {
  Category,
  MonthlyTotal,
  TransactionWithCategory,
  CategoryBreakdown,
  PaginatedResponse,
  TransactionFilters,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getMonthlyTotals: async (): Promise<MonthlyTotal[]> => {
    return fetchAPI<MonthlyTotal[]>("/api/transactions/monthly-totals");
  },

  getCategoryBreakdown: async (
    startDate?: string,
    endDate?: string,
  ): Promise<CategoryBreakdown[]> => {
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    return fetchAPI<CategoryBreakdown[]>(
      `/api/transactions/category-breakdown${query ? `?${query}` : ""}`,
    );
  },
  getTransactions: async (
    filters: TransactionFilters = {},
  ): Promise<PaginatedResponse<TransactionWithCategory>> => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.categoryId)
      params.append("categoryId", filters.categoryId.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.pageSize)
      params.append("pageSize", filters.pageSize.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const query = params.toString();

    return fetchAPI<PaginatedResponse<TransactionWithCategory>>(
      `/api/transactions${query ? `?${query}` : ""}`,
    );
  },
  getCategories: async (): Promise<Category[]> => {
    return fetchAPI<Category[]>("/api/categories");
  },
};
