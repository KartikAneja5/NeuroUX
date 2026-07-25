import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const normalizeSlug = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export default function ProductFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  selectedFramework,
  onFrameworkChange,
  priceRange,
  onPriceChange,
  onClearFilters,
  totalResults
}) {
  const frameworks = ['all', 'react', 'html-css', 'vue'];

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedFramework !== 'all' || priceRange !== 'all';

  const isCategoryActive = (catId) => {
    if (selectedCategory === 'all' || !selectedCategory) return false;
    return normalizeSlug(selectedCategory) === normalizeSlug(catId);
  };

  return (
    <div className="glass p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0c0b1e]/60 backdrop-blur-md mb-8 space-y-4 select-none">
      {/* Top Row: Search input + Results counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search UI components by title, tag, or design style..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {totalResults !== undefined && (
          <div className="text-xs text-[#8b7fb5] font-medium shrink-0 self-end sm:self-center">
            Showing <span className="text-white font-bold">{totalResults}</span> asset{totalResults === 1 ? '' : 's'}
          </div>
        )}
      </div>

      {/* Bottom Row: Filters (Category, Framework, Price) */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 flex-1">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-violet-600 text-white shadow-glow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat._id}
              onClick={() => onCategoryChange(cat.name || cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                isCategoryActive(cat.id || cat._id) || isCategoryActive(cat.name)
                  ? 'bg-violet-600 text-white shadow-glow-sm'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Framework Selector */}
        {onFrameworkChange && (
          <select
            value={selectedFramework || 'all'}
            onChange={(e) => onFrameworkChange(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all" className="bg-zinc-900 text-white">All Frameworks</option>
            {frameworks.filter(f => f !== 'all').map(f => (
              <option key={f} value={f} className="bg-zinc-900 text-white capitalize">{f}</option>
            ))}
          </select>
        )}

        {/* Price Filter */}
        {onPriceChange && (
          <select
            value={priceRange || 'all'}
            onChange={(e) => onPriceChange(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all" className="bg-zinc-900 text-white">All Prices</option>
            <option value="free" className="bg-zinc-900 text-white">Free Only</option>
            <option value="under15" className="bg-zinc-900 text-white">Under ₹999</option>
            <option value="over15" className="bg-zinc-900 text-white">₹999 and above</option>
          </select>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition font-medium"
          >
            <FiX size={13} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
