interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: (darkMode: boolean) => void;
}

export default function DarkModeToggle({
  darkMode,
  onToggle,
}: DarkModeToggleProps) {
  return (
    <button
      onClick={() => onToggle(!darkMode)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
      aria-label="Toggle dark mode"
    >
      <span>{darkMode ? "☀️" : "🌙"}</span>
      <span className="text-sm sm:text-base">{darkMode ? "Light" : "Dark"}</span>
    </button>
  );
}
