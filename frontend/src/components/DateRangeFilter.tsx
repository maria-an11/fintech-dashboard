import type { ChangeEvent } from "react";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onChange: (startDate?: string, endDate?: string) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onChange,
}: DateRangeFilterProps) {
  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && endDate && value > endDate) {
      return;
    }
    onChange(value || undefined, endDate);
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && startDate && value < startDate) {
      return;
    }
    onChange(startDate, value || undefined);
  };

  const handleClear = () => {
    onChange(undefined, undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:whitespace-nowrap">
        Date Range:
      </label>
      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
        <input
          type="date"
          value={startDate || ""}
          onChange={handleStartDateChange}
          max={endDate || undefined}
          className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
        />
        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
          to
        </span>
        <input
          type="date"
          value={endDate || ""}
          onChange={handleEndDateChange}
          min={startDate || undefined}
          className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
        />
        {(startDate || endDate) && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 whitespace-nowrap"
            aria-label="Clear date filter"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
