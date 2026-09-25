import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ 
  searchQuery, 
  statusFilter = 'all', 
  setStatusFilter,
  sortBy = 'newest', 
  jobs = [], 
  onAddCard, 
  onSelectJob,
  onResetFilter 
}) {
  
  // 1. Filter jobs dynamically based on search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const title = (job.jobTitle || job.title || '').toLowerCase();
    const company = (job.companyName || job.company || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const skills = (job.skillsRequired || '').toLowerCase();
    const tags = Array.isArray(job.tags) ? job.tags.join(' ').toLowerCase() : '';

    return (
      title.includes(query) ||
      company.includes(query) ||
      location.includes(query) ||
      skills.includes(query) ||
      tags.includes(query)
    );
  });

  // 2. Helper functions for multi-criteria sorting
  const parseSalary = (job) => {
    const str = String(job.offeredSalary || job.salary || job.expectedSalary || '');
    if (!str || str === 'N/A') return 0;
    
    // Match LPA numbers e.g. "12 LPA", "12.5 LPA"
    const lpaMatch = str.match(/([\d.]+)\s*(?:LPA|Lakhs?|L)/i);
    if (lpaMatch) return parseFloat(lpaMatch[1]) * 100000;
    
    // Extract numbers
    const nums = str.replace(/,/g, '').match(/\d+/g);
    if (nums && nums.length > 0) return parseFloat(nums.join(''));
    return 0;
  };

  const parsePriority = (job) => {
    const p = (job.priorityLevel || job.priority || '').toLowerCase();
    if (p.includes('urgent') || p.includes('high') || job.priorityScore >= 80) return 4;
    if (p.includes('medium') || job.priorityScore >= 50) return 3;
    if (p.includes('low') || job.priorityScore >= 20) return 2;
    return 1;
  };

  const parseDate = (job) => {
    const d = job.appliedDate || job.dateApplied || job.createdAt;
    if (!d) return 0;
    const time = new Date(d).getTime();
    return isNaN(time) ? 0 : time;
  };

  // 3. Multi-Criteria Sorting Engine
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return parseDate(b) - parseDate(a) || (b.id || 0) - (a.id || 0);
    }
    if (sortBy === 'oldest') {
      return parseDate(a) - parseDate(b) || (a.id || 0) - (b.id || 0);
    }
    if (sortBy === 'company-asc') {
      const compA = (a.companyName || a.company || '').toLowerCase();
      const compB = (b.companyName || b.company || '').toLowerCase();
      return compA.localeCompare(compB);
    }
    if (sortBy === 'company-desc') {
      const compA = (a.companyName || a.company || '').toLowerCase();
      const compB = (b.companyName || b.company || '').toLowerCase();
      return compB.localeCompare(compA);
    }
    if (sortBy === 'role-asc') {
      const roleA = (a.jobTitle || a.title || '').toLowerCase();
      const roleB = (b.jobTitle || b.title || '').toLowerCase();
      return roleA.localeCompare(roleB);
    }
    if (sortBy === 'salary-desc') {
      return parseSalary(b) - parseSalary(a);
    }
    if (sortBy === 'salary-asc') {
      return parseSalary(a) - parseSalary(b);
    }
    if (sortBy === 'priority') {
      return parsePriority(b) - parsePriority(a);
    }
    return 0;
  });

  const allColumns = [
    { title: 'Applied', key: 'applied', colorTheme: 'blue' },
    { title: 'Interviewing', key: 'interviewing', colorTheme: 'amber' },
    { title: 'Offered', key: 'offered', colorTheme: 'emerald' },
    { title: 'Rejected', key: 'rejected', colorTheme: 'rose' },
  ];

  // If a specific status is chosen, display ONLY that column!
  const isFilteredSingleColumn = statusFilter !== 'all';
  const visibleColumns = isFilteredSingleColumn
    ? allColumns.filter(col => col.key.toLowerCase() === statusFilter.toLowerCase().trim())
    : allColumns;

  // Fallback to allColumns if match not found
  const activeColumns = visibleColumns.length > 0 ? visibleColumns : allColumns;

  const handleReset = () => {
    if (onResetFilter) {
      onResetFilter();
    } else if (setStatusFilter) {
      setStatusFilter('all');
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Banner when viewing a single isolated column */}
      {isFilteredSingleColumn && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-rose-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Single Column View: <span className="text-rose-600 capitalize">{statusFilter}</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Viewing only all applications in <span className="font-bold text-slate-700 capitalize">{statusFilter}</span> stage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>← Show All 4 Columns</span>
          </button>
        </div>
      )}

      {/* Kanban Columns Grid: If single column, give it a spacious layout; if all, 4 columns */}
      <div className={
        isFilteredSingleColumn 
          ? "w-full max-w-2xl mx-auto" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
      }>
        {activeColumns.map((col) => {
          const colJobs = sortedJobs.filter(j => (j.status || 'applied').toLowerCase().trim() === col.key.toLowerCase());

          return (
            <KanbanColumn
              key={col.key}
              title={col.title}
              statusKey={col.key}
              count={colJobs.length}
              jobs={colJobs}
              colorTheme={col.colorTheme}
              onAddCard={onAddCard}
              onSelectJob={onSelectJob}
              isFocused={isFilteredSingleColumn}
              isDimmed={false}
            />
          );
        })}
      </div>
    </div>
  );
}
