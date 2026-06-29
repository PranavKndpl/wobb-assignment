import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { SearchBar } from "./SearchBar";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col items-center gap-6 mb-8 w-full">
      {/* Segmented Control for Platforms */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              selected === p
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>
      
      {/* Centered Search Bar */}
      <div className="w-full flex justify-center px-4">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
    </div>
  );
}