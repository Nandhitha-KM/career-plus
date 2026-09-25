import React from 'react';
import { BarChart3, TrendingUp, Award, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AnalyticsView({ jobs = [] }) {
  const total = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'applied' || !j.status).length;
  const interviewingCount = jobs.filter(j => j.status === 'interviewing').length;
  const offeredCount = jobs.filter(j => j.status === 'offered').length;
  const rejectedCount = jobs.filter(j => j.status === 'rejected').length;

  const activeCount = appliedCount + interviewingCount + offeredCount;

  // Percentage Calculations
  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0;
  const appliedRate = total > 0 ? Math.round((appliedCount / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round((interviewingCount / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offeredCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* Overview Stat Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active Application Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-800">Active Pipeline Rate</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">{activeRate}%</p>
          <p className="text-xs text-slate-500">{activeCount} of {total} active applications</p>
        </div>

        {/* Card 2: Applied Stage Share */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-sky-700">Applied Stage</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-sky-600">{appliedRate}%</p>
          <p className="text-xs text-slate-500">{appliedCount} pending response</p>
        </div>

        {/* Card 3: Interview Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-700">Interview Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">{interviewRate}%</p>
          <p className="text-xs text-slate-500">{interviewingCount} active interviews</p>
        </div>

        {/* Card 4: Offer Win Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-700">Offer Win Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{offerRate}%</p>
          <p className="text-xs text-slate-500">{offeredCount} job offers won</p>
        </div>

      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-extrabold text-slate-900">Application Conversion Funnel</h4>
          <p className="text-xs text-slate-500">Visual progress breakdown across all pipeline stages</p>
        </div>

        <div className="space-y-5">
          {/* Stage 1: Applied */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-sky-700">1. Applied Stage ({appliedRate}%)</span>
              <span className="text-slate-700">{appliedCount} Applications</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                style={{ width: `${appliedRate}%` }}
              ></div>
            </div>
          </div>

          {/* Stage 2: Interviewing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-700">2. Interviewing Stage ({interviewRate}%)</span>
              <span className="text-slate-700">{interviewingCount} Active Interviews</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${interviewRate}%` }}
              ></div>
            </div>
          </div>

          {/* Stage 3: Offered */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700">3. Offered Stage ({offerRate}%)</span>
              <span className="text-slate-700">{offeredCount} Offers Received</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${offerRate}%` }}
              ></div>
            </div>
          </div>

          {/* Stage 4: Rejected / Archived */}
          {rejectedCount > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-700">4. Rejected / Archived Stage ({total > 0 ? Math.round((rejectedCount / total) * 100) : 0}%)</span>
                <span className="text-slate-700">{rejectedCount} Applications</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (rejectedCount / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
