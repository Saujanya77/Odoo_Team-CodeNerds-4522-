
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSearch} className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by skills, location, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </form>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Category
              </label>
              <select className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Creative</option>
                <option>Language</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <option>Any Time</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Evenings</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <option>Any Rating</option>
                <option>4.5+ Stars</option>
                <option>4.0+ Stars</option>
                <option>3.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
