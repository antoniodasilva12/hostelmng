import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  onFilter: (filters: any) => void;
}

export function SearchBar({ onSearch, onFilter }: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    floor: [],
    dateRange: null,
  });

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-2 rounded-lg border hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4">
          {/* Filter options */}
        </div>
      )}
    </div>
  );
} 