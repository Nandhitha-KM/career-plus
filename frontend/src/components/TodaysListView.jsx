import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ExternalLink, 
  User, 
  ChevronRight, 
  ArrowRight, 
  FileText,
  Filter,
  Sparkles,
  CalendarPlus,
  XCircle
} from 'lucide-react';

const formatDateString = (dateVal) => {
  if (!dateVal || dateVal === 'Recently' || dateVal === 'N/A' || dateVal === 'None Set') return '';
  let str = String(dateVal).trim();
  let timestamp = Number(str);
  if (!isNaN(timestamp) && timestamp > 1000000000) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return str;
};

// Calculate relative date helpers
const getOffsetDateStr = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export default function TodaysListView({ jobs = [], onSelectJob, onUpdateReminderDate, onOpenAddJob, onNavigateKanban }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'today' | 'overdue'
  const [searchQuery, setSearchQuery] = useState('');
  const [customDateInputs, setCustomDateInputs] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = getOffsetDateStr(1);

  // Filter jobs strictly where reminderDate is <= todayStr (i.e. due today or past overdue)
  const dueJobs = jobs.filter(j => {
    const reminderRaw = j.reminderDate || j.followUpDate;
    if (!reminderRaw) return false;
    const formatted = formatDateString(reminderRaw);
    if (!formatted) return false;
    return formatted <= todayStr;
  });

  // Calculate overdue vs due today
  const overdueJobs = dueJobs.filter(j => {
    const formatted = formatDateString(j.reminderDate || j.followUpDate);
    return formatted < todayStr;
  });

  const todayExactJobs = dueJobs.filter(j => {
    const formatted = formatDateString(j.reminderDate || j.followUpDate);
    return formatted === todayStr;
  });

  // Filter based on active filter button & search query
  const displayedJobs = dueJobs.filter(j => {
    const formatted = formatDateString(j.reminderDate || j.followUpDate);
    if (filterType === 'today' && formatted !== todayStr) return false;
    if (filterType === 'overdue' && formatted >= todayStr) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const comp = (j.companyName || j.company || '').toLowerCase();
      const role = (j.jobTitle || j.title || '').toLowerCase();
      const notes = (j.notes || j.notesAndDescription || '').toLowerCase();
      return comp.includes(q) || role.includes(q) || notes.includes(q);
    }
    return true;
  }).sort((a, b) => {
    // Sort oldest overdue reminder first
    const dateA = formatDateString(a.reminderDate || a.followUpDate);
    const dateB = formatDateString(b.reminderDate || b.followUpDate);
    return dateA.localeCompare(dateB);
  });

  // Calculate days overdue
  const getDaysOverdue = (dateStr) => {
    if (!dateStr) return 0;
    const diffMs = new Date(todayStr).getTime() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleCustomDateChange = (jobId, dateVal) => {
    setCustomDateInputs(prev => ({ ...prev, [jobId]: dateVal }));
    if (dateVal && onUpdateReminderDate) {
      onUpdateReminderDate(jobId, dateVal);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-pink-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-pink-500/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/25 border border-rose-400/30 text-rose-200 text-xs font-bold tracking-wide uppercase">
              <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Today\'s Focus Action List</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Today\'s Reminder Applications
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
              Applications requiring your attention today or overdue from previous days. 
              <span className="text-amber-300 font-bold ml-1">
                Rescheduling to a future date or marking as done immediately removes the application from this list.
              </span>
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="w-12 h-12 rounded-xl bg-rose-600/60 flex items-center justify-center text-white text-xl font-black">
              {dueJobs.length}
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-rose-200">Pending Actions</p>
              <p className="text-sm font-black text-white">
                {todayExactJobs.length} Due Today • {overdueJobs.length} Overdue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Due ({dueJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'today'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Due Today ({todayExactJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('overdue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overdue ({overdueJobs.length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Filter by company, role or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Main List Display */}
      {displayedJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displayedJobs.map((job) => {
            const company = job.companyName || job.company || 'Company';
            const title = job.jobTitle || job.title || 'Untitled Role';
            const reminderDateStr = formatDateString(job.reminderDate || job.followUpDate);
            const isToday = reminderDateStr === todayStr;
            const daysOverdue = getDaysOverdue(reminderDateStr);

            return (
              <div 
                key={job.id}
                className="bg-white rounded-2xl border-2 border-rose-300 shadow-sm hover:shadow-md transition-all p-5 space-y-4"
              >
                {/* Top Row: Details & Reminder Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
                      {company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-slate-900">{title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                          job.status === 'interviewing' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : job.status === 'offered' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : job.status === 'rejected' 
                            ? 'bg-rose-50 text-rose-800 border-rose-200' 
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {job.status || 'Applied'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center gap-2">
                        <span>{company}</span>
                        <span>•</span>
                        <span className="flex items-center text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location || 'Remote'} ({job.workMode || 'Remote'})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Reminder Status Alert Badge */}
                  <div className="self-start sm:self-auto flex items-center space-x-2">
                    {isToday ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black animate-pulse">
                        <Bell className="w-3.5 h-3.5 text-rose-600" />
                        <span>🔔 Due Today ({reminderDateStr})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>⚠️ Overdue by {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} ({reminderDateStr})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes or Recruiter Snippet if present */}
                {(job.notes || job.recruiterName) && (
                  <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100 text-xs text-slate-700 space-y-1">
                    {job.recruiterName && (
                      <p className="font-bold text-rose-900 flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-rose-600" />
                        <span>Recruiter Contact: {job.recruiterName} {job.recruiterEmail && `(${job.recruiterEmail})`}</span>
                      </p>
                    )}
                    {job.notes && (
                      <p className="text-slate-600 italic line-clamp-2">
                        &ldquo;{job.notes}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Bottom Action Bar: Reschedule & Dismiss Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Immediate Reschedule Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      Reschedule:
                    </span>
                    
                    {/* +1 Day (Tomorrow) */}
                    <button
                      type="button"
                      onClick={() => onUpdateReminderDate && onUpdateReminderDate(job.id, getOffsetDateStr(1))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Move reminder to tomorrow (removes from Today's List)"
                    >
                      +1 Day (Tomorrow)
                    </button>

                    {/* +3 Days */}
                    <button
                      type="button"
                      onClick={() => onUpdateReminderDate && onUpdateReminderDate(job.id, getOffsetDateStr(3))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Move reminder to 3 days from now"
                    >
                      +3 Days
                    </button>

                    {/* +1 Week */}
                    <button
                      type="button"
                      onClick={() => onUpdateReminderDate && onUpdateReminderDate(job.id, getOffsetDateStr(7))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Move reminder to next week"
                    >
                      +1 Week
                    </button>

                    {/* Custom Date Picker */}
                    <div className="flex items-center space-x-1 pl-1">
                      <input
                        type="date"
                        min={tomorrowStr}
                        value={customDateInputs[job.id] || ''}
                        onChange={(e) => handleCustomDateChange(job.id, e.target.value)}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
                        title="Pick custom future reminder date"
                      />
                    </div>
                  </div>

                  {/* Primary Actions: Mark Done / View Details */}
                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    {/* Mark Done / Dismiss Button */}
                    <button
                      type="button"
                      onClick={() => onUpdateReminderDate && onUpdateReminderDate(job.id, null)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Clear reminder date & mark completed (removes from Today's List)"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Done (Dismiss)</span>
                    </button>

                    {/* View Details Modal Button */}
                    <button
                      type="button"
                      onClick={() => onSelectJob && onSelectJob(job)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              All Caught Up for Today! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              No applications currently have a reminder scheduled for today or overdue from past days. 
              When you set a reminder date on an application that is due today or earlier, it will automatically appear here.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onNavigateKanban && (
              <button
                type="button"
                onClick={onNavigateKanban}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Go to Kanban Board
              </button>
            )}
            {onOpenAddJob && (
              <button
                type="button"
                onClick={onOpenAddJob}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                + Add New Application
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
