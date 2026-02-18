import { useState, useEffect, useCallback } from "react";
import { api } from "./lib/api";
import type {
  MonthlyTotal,
  CategoryBreakdown,
  TransactionWithCategory,
  TransactionFilters,
} from "./types";
import MonthlyChart from "./components/MonthlyChart";
import CategoryBreakdownChart from "./components/CategoryBreakdownChart";
import DateRangeFilter from "./components/DateRangeFilter";
import CategoryFilter from "./components/CategoryFilter";
import TransactionTable from "./components/TransactionTable";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    [],
  );
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [monthlyData, categoryData, transactionData] = await Promise.all([
        api.getMonthlyTotals(),
        api.getCategoryBreakdown(filters.startDate, filters.endDate),
        api.getTransactions(filters),
      ]);

      setMonthlyTotals(monthlyData);
      setCategoryBreakdown(categoryData);
      setTransactions(transactionData.data);
      setPagination(transactionData.pagination);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    setFilters((prev) => ({ ...prev, startDate, endDate, page: 1 }));
  };

  const handleCategoryChange = (categoryId?: number) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (
    sortBy: "date" | "amount" | "created_at",
    sortOrder: "asc" | "desc",
  ) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  if (loading && monthlyTotals.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Financial Dashboard
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Track and analyze your transactions
            </p>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={setDarkMode} />
        </header>

        {error && <ErrorMessage message={error} onRetry={fetchData} />}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <DateRangeFilter
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={handleDateRangeChange}
          />

          <CategoryFilter
            categoryId={filters.categoryId}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Totals
            </h2>
            {loading && monthlyTotals.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <MonthlyChart data={monthlyTotals} />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Category Breakdown
            </h2>
            {loading && categoryBreakdown.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <CategoryBreakdownChart data={categoryBreakdown} />
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Transactions
            </h2>
            {loading && transactions.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <TransactionTable
                transactions={transactions}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                currentSort={filters.sortBy || "date"}
                currentSortOrder={filters.sortOrder || "desc"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
