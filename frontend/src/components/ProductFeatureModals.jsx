import React from 'react';
import { X, LayoutGrid, Bell, BarChart3, Briefcase, CheckCircle2, ShieldCheck, Clock, ArrowRight, Zap, Target } from 'lucide-react';

// 1. Application Tracker Feature Modal
export function ApplicationTrackerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-rose-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Application Tracker Module</h3>
              <p className="text-xs text-slate-500 font-medium">Centralized Job &amp; Internship Application Recording System</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-900 font-bold">
              Organize company name, role, salary offer, location, work mode, and application stage in one unified view.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
                Structured Application Entry Creation
              </h4>
              <p className="text-slate-600">
                Log new applications with company name, job title, job URL, offered salary, location, and customized resume attachments in seconds.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
                User-Scoped Account Privacy
              </h4>
              <p className="text-slate-600">
                Your entries are saved under your private user key (<code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">careerplus_jobs_${userKey}</code>) with 100% candidate data isolation.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Product Suite</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20 cursor-pointer">
            Close Module Overview
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Kanban Board Feature Modal
export function KanbanBoardFeatureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-indigo-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
              <LayoutGrid className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">4-Stage Visual Kanban Board</h3>
              <p className="text-xs text-slate-500 font-medium">Track Applied, Interviewing, Offered &amp; Rejected Pipeline</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center space-x-3">
            <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <p className="text-xs text-indigo-900 font-bold">
              Visual pipeline tracking gives candidates instant clarity on application momentum and active recruitment stages.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">The 4 Pipeline Stages</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <div className="p-2.5 bg-violet-100/80 text-violet-900 rounded-xl">1. Applied Stage</div>
                <div className="p-2.5 bg-amber-100/80 text-amber-900 rounded-xl">2. Interviewing Stage</div>
                <div className="p-2.5 bg-emerald-100/80 text-emerald-900 rounded-xl">3. Offered Stage</div>
                <div className="p-2.5 bg-rose-100/80 text-rose-900 rounded-xl">4. Rejected Stage</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Interactive Status Transition Dates</h4>
              <p className="text-slate-600">
                Moving a card from Applied to Interviewing prompts an interactive date modal to log the exact transition date for recruiter timeline tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Kanban Pipeline</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
            Close Kanban Overview
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Follow-up Reminders Feature Modal
export function FollowUpSystemModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Automated 7-Day Follow-Up Alert System</h3>
              <p className="text-xs text-slate-500 font-medium">Never Lose Touch with Recruiters After Applying</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-900 font-bold">
              Strict 7-Day Rule: Cards inactive for &gt;= 7 days automatically trigger yellow attention styling &amp; action badges.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Yellow Follow-up Cards</h4>
              <p className="text-slate-600">
                Roles created or updated within 7 days display in clean normal white. When inactivity exceeds 7 days, the system changes the card to a yellow follow-up warning theme.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Recruiter Follow-up Workspace Tab</h4>
              <p className="text-slate-600">
                Click the <strong>Reminders &amp; Notes (⚡ Action Due)</strong> tab to view all 7-day pending applications and log recruiter notes.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Follow-up System</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
            Close Alert System
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Analytics Dashboard Feature Modal
export function AnalyticsEngineModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-cyan-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shadow-xs">
              <BarChart3 className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Analytics &amp; Insights Engine</h3>
              <p className="text-xs text-slate-500 font-medium">Real-Time Application Conversion Rates &amp; Progress Metrics</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <p className="text-xs text-cyan-900 font-bold">
              Monitor response rates, interview invitation ratios, and offer acceptance progress automatically.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Live Stage Breakdown &amp; Metrics</h4>
              <p className="text-slate-600">
                Visual progress bars show the exact percentage of applications progressing from Applied $\rightarrow$ Interviewing $\rightarrow$ Offered.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">1-Click Excel Exporter Integration</h4>
              <p className="text-slate-600">
                Export your analytics dataset into an Excel/CSV spreadsheet containing Company Name, Current Stage, Role, Salary, and Company Location.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Analytics Engine</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
            Close Analytics Overview
          </button>
        </div>
      </div>
    </div>
  );
}
