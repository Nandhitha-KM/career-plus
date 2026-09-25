import React from 'react';
import { ShieldAlert, Zap, Clock, ArrowUpRight, CheckCircle2, Info, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

export default function PriorityEngineView({ jobs = [] }) {
  // Priority calculation helper
  const getPriorityInfo = (job) => {
    let score = 30; // base score
    if (typeof job.priorityScore === 'number' && job.priorityScore > 0) {
      score = Math.round(job.priorityScore);
    } else {
      if (job.status === 'interviewing') score += 40;
      if (job.status === 'applied') score += 20;
      if (job.status === 'offered') score += 10;
      if (job.interviewDate) score += 25;
    }
    score = Math.min(100, Math.max(0, score));

    let level = 'LOW';
    let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let dot = 'bg-emerald-500';

    if (score >= 70) {
      level = 'HIGH';
      badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
      dot = 'bg-rose-500';
    } else if (score >= 40) {
      level = 'MEDIUM';
      badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
      dot = 'bg-amber-500';
    }

    return { score, level, badgeBg, dot };
  };

  const prioritizedJobs = jobs.map(j => ({
    ...j,
    priority: getPriorityInfo(j)
  })).sort((a, b) => b.priority.score - a.priority.score);

  return (
    <div className="space-y-8">
      
      {/* Priority Engine Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Priority Engine Overview</h3>
              <p className="text-xs text-slate-500">Smart urgency scoring to prioritize your daily job search activities</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>High (≥ 70)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium (40–69)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Low (&lt; 40)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crisp "How Priority Works" Explainer Card */}
      <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-rose-50/40 rounded-3xl p-6 border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-rose-950">How the Priority Engine Works</h4>
            <p className="text-xs text-rose-800/90 font-medium">
              Ranks your applications by urgency so you know exactly which company needs your attention today.
            </p>
          </div>
        </div>

        {/* 4 Core Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-white/95 rounded-2xl p-4 border border-rose-100 shadow-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-700">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-black text-slate-900">Upcoming Interviews</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Interviews scheduled in the next 3 days are immediately promoted to the top so you can prepare.
            </p>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-rose-100 shadow-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-black text-slate-900">Application Stage</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Active interview rounds and high-match applications receive greater weight than initial submissions.
            </p>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-rose-100 shadow-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-700">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black text-slate-900">Days Since Applied</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Urgency steadily climbs as days go by, ensuring older applications are never forgotten.
            </p>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-rose-100 shadow-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-700">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-black text-slate-900">Follow-up Alerts</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Applications waiting 7+ days without recruiter response are flagged so you can send a follow-up.
            </p>
          </div>
        </div>

        {/* Action Guide */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-rose-200/60 text-xs">
          <span className="text-[11px] font-black text-rose-950 uppercase tracking-wider">Action Guide:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-rose-900 font-bold">High (≥ 70)</span>
            <span className="text-slate-600 font-medium">— Take action today (interview prep or follow-up)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-amber-900 font-bold">Medium (40–69)</span>
            <span className="text-slate-600 font-medium">— Active in pipeline (monitor recruiter status)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-900 font-bold">Low (&lt; 40)</span>
            <span className="text-slate-600 font-medium">— Fresh submission / waiting period</span>
          </div>
        </div>
      </div>

      {/* Prioritized Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h4 className="text-sm font-bold text-slate-800">Scored Application Rankings</h4>
          <span className="text-xs text-slate-500 font-medium">{prioritizedJobs.length} Applications Evaluated</span>
        </div>

        {prioritizedJobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {prioritizedJobs.map((job) => (
              <div key={job.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{job.title}</h5>
                    <p className="text-xs text-slate-500">{job.company} • {job.location || 'Remote'}</p>
                  </div>
                </div>

                {/* Score & Priority Pill */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500">Priority Score</p>
                    <p className="text-lg font-black text-slate-900">{job.priority.score} / 100</p>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${job.priority.badgeBg} flex items-center space-x-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${job.priority.dot}`}></span>
                    <span>{job.priority.level} PRIORITY</span>
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No applications found to evaluate. Add a new application to trigger the Priority Engine.
          </div>
        )}
      </div>

    </div>
  );
}
