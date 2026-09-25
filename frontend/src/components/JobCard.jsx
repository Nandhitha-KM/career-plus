import React from 'react';
import { MapPin, DollarSign, MoreHorizontal, Clock, ExternalLink, User, Calendar, Bell, FileText, Globe, Tag, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

const formatDateString = (dateVal) => {
  if (!dateVal || dateVal === 'Recently' || dateVal === 'N/A' || dateVal === 'Not Scheduled' || dateVal === 'None Set') {
    return dateVal || 'Recently';
  }
  let str = String(dateVal).trim();
  let timestamp = Number(str);
  if (!isNaN(timestamp) && timestamp > 1000000000) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return str;
};

const getFlowDates = (job) => {
  if (!job) return { applied: null, interviewing: null, offered: null, rejected: null };
  const status = (job.status || 'applied').toLowerCase().trim();

  let applied = job.appliedDate || job.dateApplied || job.statusHistory?.applied || null;
  let interviewing = job.interviewingDate || job.interviewDate || job.statusHistory?.interviewing || null;
  let offered = job.offeredDate || job.statusHistory?.offered || null;
  let rejected = job.rejectedDate || job.statusHistory?.rejected || null;

  if (status === 'applied') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    interviewing = null;
    offered = null;
    rejected = null;
  } else if (status === 'interviewing') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!interviewing) interviewing = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
    offered = null;
    rejected = null;
  } else if (status === 'offered') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!offered) offered = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
    rejected = null;
  } else if (status === 'rejected') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!rejected) rejected = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
  }

  return { applied, interviewing, offered, rejected };
};

export default function JobCard({ job, onClick }) {
  if (!job) return null;

  const company = job.companyName || job.company || 'Company';
  const title = job.jobTitle || job.title || 'Untitled Role';
  const logo = job.logo ? job.logo : company.charAt(0).toUpperCase();

  // Inactivity Calculation (STRICTLY > 7 Days Inactive from current date = Yellow Follow-up Card)
  const calculateDaysInactive = () => {
    const d = job.lastStatusChangeDate || job.updatedAt || job.appliedDate || job.dateApplied || job.createdAt;
    if (!d || d === 'Recently') return 0;
    let timestamp = Number(d);
    let timeMs = !isNaN(timestamp) && timestamp > 1000000000 ? timestamp : new Date(d).getTime();
    if (isNaN(timeMs)) return 0;
    const diffDays = Math.floor((Date.now() - timeMs) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysInactive = calculateDaysInactive();
  const status = (job.status || 'applied').toLowerCase().trim();
  const isFollowUp = (status !== 'offered' && status !== 'rejected') && (daysInactive >= 7 || job.isFollowUp === true);

  const todayStr = new Date().toISOString().split('T')[0];
  const reminderRaw = job.reminderDate || job.followUpDate || null;
  const isReminderDue = reminderRaw && formatDateString(reminderRaw) <= todayStr && (status !== 'offered' && status !== 'rejected');
  const isReminderUpcoming = reminderRaw && formatDateString(reminderRaw) > todayStr && (status !== 'offered' && status !== 'rejected');
  const reminderDateFormatted = reminderRaw ? formatDateString(reminderRaw) : null;

  const avatarGradients = [
    'from-rose-600 to-pink-700 text-white shadow-rose-600/25',
    'from-pink-600 to-rose-700 text-white shadow-pink-600/25',
    'from-rose-700 to-rose-950 text-white shadow-rose-700/25',
    'from-rose-500 to-pink-600 text-white shadow-rose-500/25',
    'from-amber-500 to-rose-600 text-white shadow-rose-500/25',
  ];

  const avatarIndex = company.length % avatarGradients.length;
  const avatarStyle = avatarGradients[avatarIndex];

  // Tags processing: strictly avoid duplicate 'Full-time' or 'Remote' badges that already appear above
  const rawTags = typeof job.skillsRequired === 'string' 
    ? job.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) 
    : (Array.isArray(job.tags) ? job.tags.map(t => String(t).trim()).filter(Boolean) : []);

  const displayTags = rawTags.filter(t => {
    const lower = t.toLowerCase();
    const appType = (job.applicationType || 'full-time').toLowerCase();
    const workMode = (job.workMode || 'remote').toLowerCase();
    return lower !== appType && lower !== workMode && lower !== 'full-time' && lower !== 'remote';
  }).slice(0, 3);

  const salaryDisplay = job.offeredSalary || job.salary || job.expectedSalary;
  
  const flowDates = getFlowDates(job);
  
  const appliedDateFormatted = flowDates.applied ? formatDateString(flowDates.applied) : null;
  const interviewDateFormatted = flowDates.interviewing ? formatDateString(flowDates.interviewing) : null;
  const offeredDateFormatted = flowDates.offered ? formatDateString(flowDates.offered) : null;
  const rejectedDateFormatted = flowDates.rejected ? formatDateString(flowDates.rejected) : null;
  const lastUpdatedFormatted = formatDateString(job.lastStatusChangeDate || job.updatedAt || job.appliedDate || new Date().toISOString().split('T')[0]);

  return (
    <div 
      onClick={() => onClick && onClick(job)}
      className={`group rounded-3xl p-4 transition-all duration-200 relative cursor-pointer transform hover:-translate-y-0.5 flex flex-col justify-between w-full h-[470px] min-h-[470px] max-h-[470px] box-border overflow-hidden ${
        isReminderDue
          ? 'bg-rose-50/90 border-2 border-rose-400 shadow-md shadow-rose-500/15 hover:shadow-xl hover:border-rose-500 ring-2 ring-rose-400/20'
          : isFollowUp 
          ? 'bg-amber-50/95 border-2 border-amber-400 shadow-md shadow-amber-500/15 hover:shadow-xl hover:border-amber-500 ring-2 ring-amber-400/20' 
          : 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-rose-400/80 hover:shadow-rose-500/10'
      }`}
    >
      {/* Top Notification Badge: Fixed height ensures 100% equal alignment across all cards */}
      <div className="mb-2 flex items-center justify-between gap-2 h-6 flex-shrink-0">
        {isReminderDue ? (
          <>
            <span className="bg-rose-100 text-rose-950 border border-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center shadow-2xs animate-pulse truncate">
              <Bell className="w-3 h-3 mr-1 text-rose-700 animate-bounce flex-shrink-0" />
              <span className="truncate">Reminder Due! ({reminderDateFormatted})</span>
            </span>
            <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider flex-shrink-0">Review Date</span>
          </>
        ) : isFollowUp ? (
          <>
            <span className="bg-amber-200/90 text-amber-950 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center shadow-2xs flex-shrink-0">
              <AlertTriangle className="w-3 h-3 mr-1 text-amber-800 flex-shrink-0" />
              <span>Follow-up Due ({daysInactive > 0 ? `${daysInactive}d` : '>7d'})</span>
            </span>
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex-shrink-0">Action Needed</span>
          </>
        ) : isReminderUpcoming ? (
          <>
            <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center truncate">
              <Bell className="w-3 h-3 mr-1 text-rose-500 flex-shrink-0" />
              <span className="truncate">Remind: {reminderDateFormatted}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">Scheduled</span>
          </>
        ) : (
          <>
            <span className="bg-slate-100 text-slate-600 border border-slate-200/70 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
              <span>Application Tracked</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider capitalize">{job.status || 'applied'}</span>
          </>
        )}
      </div>

      {/* Card Header: Logo, Title & Company */}
      <div className="flex items-start justify-between gap-2.5 mb-2 flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarStyle} flex items-center justify-center font-black text-base shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {logo}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors truncate leading-snug" title={title}>
              {title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-slate-500">
              <span className="truncate max-w-[130px]">{company}</span>
              {job.workMode && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold flex-shrink-0 ${
                  isFollowUp ? 'bg-amber-100/80 text-amber-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {job.workMode}
                </span>
              )}
            </div>
          </div>
        </div>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick && onClick(job); }}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
          title="View Details"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Meta Information Details Container */}
      <div className="flex-1 flex flex-col justify-start space-y-1.5 my-1.5 overflow-hidden text-xs">
        
        {/* Row 1: Location & Application Type */}
        <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] flex-shrink-0 ${
          isFollowUp ? 'bg-amber-100/60 border-amber-200/80 text-amber-900' : 'bg-slate-50/80 border-slate-200/50 text-slate-600'
        }`}>
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="truncate font-medium">{job.location || 'Remote'}</span>
          </div>
          <span className="font-bold text-rose-800 bg-rose-50/90 border border-rose-200/60 px-2 py-0.5 rounded-md flex-shrink-0 text-[10px]">
            {job.applicationType || 'Full-time'}
          </span>
        </div>
        
        {/* Row 2: Offered Salary */}
        {salaryDisplay && salaryDisplay !== 'N/A' && (
          <div className="flex items-center justify-between gap-2 bg-rose-50/70 border border-rose-200/80 px-2.5 py-1.5 rounded-xl text-[11px] flex-shrink-0">
            <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider flex-shrink-0">Salary:</span>
            <div className="flex items-center text-rose-800 font-black tabular-nums">
              <span className="mr-0.5 text-rose-600 font-bold">₹</span>
              <span>{salaryDisplay}</span>
            </div>
          </div>
        )}

        {/* Row 3: Recruiter Contact Info */}
        {job.recruiterName && (
          <div className="flex items-center space-x-1.5 text-slate-600 text-[11px] px-1 flex-shrink-0">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">Contact: <strong>{job.recruiterName}</strong></span>
          </div>
        )}

        {/* Row 4: Attached Resume File */}
        {job.resumeName && (
          <div className="flex items-center space-x-1.5 text-rose-800 bg-rose-50/70 border border-rose-200/70 px-2.5 py-1 rounded-xl text-[11px] font-semibold flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="truncate" title={job.resumeName}>{job.resumeName}</span>
          </div>
        )}

        {/* Row 5: Notes & Comments */}
        {job.notes && String(job.notes).trim() && (
          <div className="flex items-start space-x-1.5 bg-slate-50/90 border border-slate-200/80 p-2 rounded-xl text-[11px] flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-[10.5px] italic text-slate-700 font-medium leading-tight">
              "{String(job.notes).trim()}"
            </span>
          </div>
        )}

        {/* Optional Skills Badges */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 flex-shrink-0">
            {displayTags.map((tag, idx) => (
              <span 
                key={idx}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors ${
                  isFollowUp 
                    ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200' 
                    : 'bg-slate-100 text-slate-700 border-slate-200/70 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Date Breakdown Container: Fixed equal structure */}
      <div className={`my-1.5 p-2.5 rounded-2xl border text-[10.5px] space-y-1.5 flex flex-col justify-center flex-shrink-0 ${
        isFollowUp ? 'bg-amber-100/70 border-amber-300 text-amber-950' : 'bg-slate-50/90 border-slate-200/70 text-slate-600'
      }`}>
        {appliedDateFormatted && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500 flex items-center flex-shrink-0">
              <Clock className="w-3 h-3 mr-1.5 text-slate-400 flex-shrink-0" /> Applied:
            </span>
            <span className="font-bold text-slate-800 tabular-nums">{appliedDateFormatted}</span>
          </div>
        )}

        {interviewDateFormatted && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-amber-800 flex items-center flex-shrink-0">
              <Calendar className="w-3 h-3 mr-1.5 text-amber-600 flex-shrink-0" /> Interviewing:
            </span>
            <span className="font-bold text-amber-900 tabular-nums">{interviewDateFormatted}</span>
          </div>
        )}

        {offeredDateFormatted && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-emerald-800 flex items-center flex-shrink-0">
              <Sparkles className="w-3 h-3 mr-1.5 text-emerald-600 flex-shrink-0" /> Offered:
            </span>
            <span className="font-bold text-emerald-900 tabular-nums">{offeredDateFormatted}</span>
          </div>
        )}

        {rejectedDateFormatted && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-rose-800 flex items-center flex-shrink-0">
              <AlertTriangle className="w-3 h-3 mr-1.5 text-rose-600 flex-shrink-0" /> Rejected:
            </span>
            <span className="font-bold text-rose-900 tabular-nums">{rejectedDateFormatted}</span>
          </div>
        )}

        {reminderDateFormatted && (
          <div className="flex items-center justify-between gap-2">
            <span className={`font-medium flex items-center flex-shrink-0 ${isReminderDue ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>
              <Bell className={`w-3 h-3 mr-1.5 flex-shrink-0 ${isReminderDue ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`} /> Reminder:
            </span>
            <span className={`font-bold tabular-nums ${isReminderDue ? 'text-rose-900 bg-rose-200/80 px-1.5 py-0.2 rounded font-extrabold text-[10px]' : 'text-slate-800'}`}>
              {reminderDateFormatted}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-slate-200/70 pt-1 mt-0.5">
          <span className="font-bold text-rose-700 flex items-center flex-shrink-0">
            <RefreshCw className="w-3 h-3 mr-1.5 text-rose-600 flex-shrink-0" /> Last Updated:
          </span>
          <span className="font-black text-rose-900 tabular-nums">{lastUpdatedFormatted}</span>
        </div>
      </div>

      {/* Card Footer: Cleanly bordered, Status & Details */}
      <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] flex-shrink-0 ${
        isFollowUp ? 'border-amber-200/80 text-amber-900' : 'border-slate-100 text-slate-500'
      }`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Status: <span className="font-black text-slate-700 capitalize">{job.status || 'applied'}</span>
        </span>
        
        <span className="text-rose-700 font-extrabold flex items-center group-hover:translate-x-1 transition-transform">
          Details <ExternalLink className="w-3 h-3 ml-1" />
        </span>
      </div>

    </div>
  );
}
