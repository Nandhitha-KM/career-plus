import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, statusFilter = 'all', setStatusFilter, sortBy = 'newest', setSortBy }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            id="dashboard-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications by role, company, or technology..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & Sort Options */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          
          {/* Status Filter Select (Triggers Column Zoom & Focus Mode) */}
          <div className="relative">
            <select 
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter && setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 hover:border-rose-300 text-slate-800 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer transition-all shadow-2xs"
            >
              <option value="all">All Statuses (All Columns)</option>
              <option value="applied">Applied Column Only</option>
              <option value="interviewing">Interviewing Column Only</option>
              <option value="offered">Offered Column Only</option>
              <option value="rejected">Rejected Column Only</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-rose-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clean Multi-Criteria Sort Select (No Icons Inside Options) */}
          <div className="relative">
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy && setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 hover:border-rose-300 text-slate-800 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer transition-all shadow-2xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="company-asc">Sort: Company (A - Z)</option>
              <option value="company-desc">Sort: Company (Z - A)</option>
              <option value="role-asc">Sort: Job Role (A - Z)</option>
              <option value="salary-desc">Sort: Salary (Highest First)</option>
              <option value="salary-asc">Sort: Salary (Lowest First)</option>
              <option value="priority">Sort: Priority (High First)</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}
