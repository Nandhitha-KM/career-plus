import React from 'react';
import { BellRing } from 'lucide-react';
import JobCard from './JobCard';

export default function FollowUpNotesView({ jobs = [], onSelectJob }) {
  // Calculate exact inactive days from last status update date or applied date
  const calculateDaysInactive = (dateStr) => {
    if (!dateStr || dateStr === 'Recently') return 0;
    let str = String(dateStr).trim();
    let timestamp = Number(str);
    let timeMs = !isNaN(timestamp) && timestamp > 1000000000 ? timestamp : new Date(str).getTime();
    if (isNaN(timeMs)) return 0;
    const diffDays = Math.floor((Date.now() - timeMs) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Filter applications that require follow-up (STRICTLY > 7 days inactive from current date)
  const isFollowUpJob = (j) => {
    const status = (j.status || 'applied').toLowerCase().trim();
    if (status === 'offered' || status === 'rejected') return false;
    const days = calculateDaysInactive(j.lastStatusChangeDate || j.updatedAt || j.appliedDate || j.dateApplied || j.createdAt);
    return days >= 7;
  };

  const followUpJobs = jobs.filter(isFollowUpJob);

  return (
    <div className="space-y-6">
      
      {/* Follow-Up Workspace Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-pink-900 to-amber-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 border border-white/30 px-3 py-1 rounded-full text-xs font-black text-amber-100">
              <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>&gt; 7-Day Inactivity Recruiter Alerts</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Recruiter Follow-up Workspace
            </h2>
            <p className="text-xs md:text-sm text-amber-100/90 font-medium leading-relaxed">
              Below are all job applications with no status updates for more than 7 days from today. Reach out to recruiters to follow up on your candidacy.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] text-center self-start md:self-auto">
            <span className="text-3xl font-black text-amber-300">{followUpJobs.length}</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100">Action Needed</span>
          </div>
        </div>
      </div>

      {/* Yellow Application Cards Grid (> 7 Days Inactive) */}
      {followUpJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {followUpJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={{ ...job, isFollowUp: true }} 
              onClick={onSelectJob} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h3 className="text-base font-extrabold text-slate-800">All Applications Up To Date!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No applications have been inactive for more than 7 days without a status update. Updating job status resets the 7-day follow-up counter automatically.
          </p>
        </div>
      )}

    </div>
  );
}
