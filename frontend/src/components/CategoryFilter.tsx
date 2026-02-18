import { useEffect, useState, useRef } from "react";
import type { Category } from "../types";
import { api } from "../lib/api";

interface CategoryFilterProps {
  categoryId?: number;
  onChange: (categoryId?: number) => void;
}

export default function CategoryFilter({
  categoryId,
  onChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:whitespace-nowrap">
        Category:
      </label>
      <div className="relative w-full sm:w-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 pl-3 pr-3 py-2 w-full sm:w-auto sm:min-w-[180px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1 transition-colors"
        >
          <span className="text-sm">
            {selectedCategory?.name || "All Categories"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full sm:w-auto sm:min-w-[180px] mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                !categoryId
                  ? "bg-secondary/10 text-secondary font-medium"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                  categoryId === cat.id
                    ? "bg-secondary/10 text-secondary font-medium"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
