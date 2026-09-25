import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { Plus, Inbox, CheckCircle2, Clock, XCircle, FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KanbanColumn({ title, statusKey, count, jobs = [], colorTheme, onAddCard, onSelectJob, isFocused = false, isDimmed = false }) {
  // STRICTLY 1 CARD (CONTAINER) PER PAGE AS REQUESTED
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = jobs.length || 1;

  // Keep currentPage within valid bounds if jobs change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [jobs.length, totalPages, currentPage]);

  const currentJob = jobs.length > 0 ? jobs[currentPage - 1] : null;

  const headerThemes = {
    applied: {
      dot: 'bg-sky-500',
      badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200',
      topLine: 'bg-sky-500',
      colBg: 'bg-white/80 border-rose-100/70',
      focusedBorder: 'border-sky-500 ring-sky-500/20 text-sky-700',
      icon: <FileText className="w-4 h-4 text-sky-600" />
    },
    interviewing: {
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200',
      topLine: 'bg-amber-500',
      colBg: 'bg-white/80 border-rose-100/70',
      focusedBorder: 'border-amber-500 ring-amber-500/20 text-amber-700',
      icon: <Clock className="w-4 h-4 text-amber-500" />
    },
    offered: {
      dot: 'bg-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      topLine: 'bg-emerald-600',
      colBg: 'bg-white/80 border-rose-100/70',
      focusedBorder: 'border-emerald-500 ring-emerald-500/20 text-emerald-700',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    },
    rejected: {
      dot: 'bg-rose-500',
      badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200',
      topLine: 'bg-rose-500',
      colBg: 'bg-white/80 border-rose-100/70',
      focusedBorder: 'border-rose-500 ring-rose-500/20 text-rose-700',
      icon: <XCircle className="w-4 h-4 text-rose-500" />
    }
  };

  const theme = headerThemes[statusKey] || headerThemes.applied;

  return (
    <div 
      className={`flex flex-col justify-between rounded-3xl border h-full p-4 transition-all duration-300 relative ${
        isFocused 
          ? `bg-white border-2 ${theme.focusedBorder} shadow-2xl scale-[1.03] z-30 ring-4 ring-offset-2` 
          : isDimmed 
          ? `opacity-35 scale-[0.97] filter blur-[0.2px] hover:opacity-90 hover:scale-100 ${theme.colBg} shadow-2xs` 
          : `${theme.colBg} shadow-xs`
      }`}
    >
      
      {/* Top Section: Header Accent + Column Title */}
      <div>
        {/* Top Line Accent */}
        <div className={`absolute top-0 left-6 right-6 h-1.5 ${theme.topLine} rounded-b-md`}></div>

        {/* Focus Mode Active Header Badge */}
        {isFocused && (
          <div className="mb-2 flex items-center justify-center">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.badgeBg} flex items-center space-x-1 shadow-xs animate-pulse`}>
              <Sparkles className="w-3 h-3 mr-1" />
              <span>FOCUS MODE ACTIVE</span>
            </span>
          </div>
        )}

        {/* Column Header */}
        <div className="flex items-center justify-between pt-1 pb-3 px-1 mb-3 border-b border-slate-200/60">
          <div className="flex items-center space-x-2">
            {theme.icon}
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${theme.badgeBg}`}>
              {jobs.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onAddCard}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
            title={`Add card to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Card Display Container: EXACT EQUAL SIZE (470px) FOR ALL COLUMNS */}
        <div className="w-full flex flex-col justify-start">
          {currentJob ? (
            <JobCard key={currentJob.id} job={currentJob} onClick={onSelectJob} />
          ) : (
            <div className="h-[470px] min-h-[470px] max-h-[470px] border-2 border-dashed border-slate-200/80 rounded-3xl flex flex-col items-center justify-center p-6 text-center bg-white/40 box-border">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-black text-slate-700">No Applications</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                No opportunities in {title} stage
              </p>
              <button
                type="button"
                onClick={onAddCard}
                className="mt-4 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Application</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Controls Container (Pagination + Stage Summary + Add Card Button) */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-2 flex flex-col justify-end">
        
        {/* Modern 1-Card Pagination Controller */}
        <div className="p-2.5 bg-white/95 border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage <= 1 || jobs.length <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-bold text-xs"
            title="Previous Application"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <div className="flex flex-col items-center min-h-[32px] justify-center">
            <span className="text-xs font-black text-slate-800 tracking-tight">
              {jobs.length > 0 ? `Card ${currentPage} of ${jobs.length}` : '0 of 0'}
            </span>

            {/* Clickable Progress Dots for Direct Jump */}
            {jobs.length > 1 ? (
              <div className="flex items-center gap-1 mt-1 max-w-[130px] overflow-x-auto py-0.5 custom-scrollbar">
                {jobs.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`transition-all rounded-full cursor-pointer flex-shrink-0 ${
                      currentPage === idx + 1
                        ? 'w-4 h-1.5 bg-rose-600 shadow-xs'
                        : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={`Go to Card ${idx + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="h-2 mt-1"></div>
            )}
          </div>

          <button
            type="button"
            disabled={currentPage >= jobs.length || jobs.length <= 1}
            onClick={() => setCurrentPage(p => Math.min(jobs.length, p + 1))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-bold text-xs"
            title="Next Application"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Application Count Pill */}
        <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-600">
            {jobs.length} {jobs.length === 1 ? 'Application' : 'Applications'} Total
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
            {title}
          </span>
        </div>

        {/* Footer Add Card Button */}
        <button
          type="button"
          onClick={onAddCard}
          className="w-full py-2.5 px-3 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-rose-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-rose-700 flex items-center justify-center space-x-1.5 transition-all group cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
          <span>Add Card</span>
        </button>

      </div>

    </div>
  );
}
