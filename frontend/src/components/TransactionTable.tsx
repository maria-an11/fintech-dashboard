import type { TransactionWithCategory } from "../types";
import { format } from "date-fns";
import { tintWithAccent } from "../lib/colorUtils";

interface TransactionTableProps {
  transactions: TransactionWithCategory[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSortChange: (
    sortBy: "date" | "amount" | "created_at",
    sortOrder: "asc" | "desc",
  ) => void;
  currentSort: "date" | "amount" | "created_at";
  currentSortOrder: "asc" | "desc";
}

export default function TransactionTable({
  transactions,
  pagination,
  onPageChange,
  onSortChange,
  currentSort,
  currentSortOrder,
}: TransactionTableProps) {
  const handleSort = (column: "date" | "amount" | "created_at") => {
    const newOrder =
      column === currentSort && currentSortOrder === "desc" ? "asc" : "desc";
    onSortChange(column, newOrder);
  };

  const renderSortButton = (
    column: "date" | "amount" | "created_at",
    label: string,
  ) => {
    const isActive = column === currentSort;
    return (
      <button
        type="button"
        onClick={() => handleSort(column)}
        title="Click to sort"
        className="flex items-center gap-1.5 rounded px-1 py-0.5 -mx-1 -my-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        {label}
        <span
          className={`text-sm ${
            isActive
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500"
          }`}
          aria-hidden
        >
          {isActive ? (currentSortOrder === "asc" ? "↑" : "↓") : "↑↓"}
        </span>
      </button>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6 ">
      <table className="w-full text-left min-w-[300px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              {renderSortButton("date", "Date")}
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
              <div className="flex justify-end">
                {renderSortButton("amount", "Amount")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {format(new Date(transaction.transaction_date), "MMM dd, yyyy")}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3">
                <span
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium"
                  style={{
                    backgroundColor: `${tintWithAccent(transaction.category.color)}20`,
                    color: tintWithAccent(transaction.category.color),
                  }}
                >
                  {transaction.category.name}
                </span>
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {transaction.description || "-"}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 text-right whitespace-nowrap">
                $
                {transaction.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            <span className="hidden sm:inline">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total,
              )}{" "}
              of {pagination.total} transactions
            </span>
            <span className="sm:hidden">
              Page {pagination.page}/{pagination.totalPages}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              Previous
            </button>
            <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
