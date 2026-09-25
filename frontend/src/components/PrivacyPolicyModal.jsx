import React from 'react';
import { X, ShieldCheck, Check, Lock, Eye, Database, FileText } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">CareerPlus Privacy Policy</h3>
              <p className="text-xs text-slate-500 font-medium">Candidate Data Protection &amp; Security Standards</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3">
            <Lock className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-900 font-bold">
              Your job search data is 100% private. We never sell, share, or monetize your candidate information.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              1. Information We Collect
            </h4>
            <p className="pl-4 text-slate-600">
              When you register for a CareerPlus candidate account, we collect your basic profile information (Full Name, Email Address) and candidate preferences. When tracking job applications, we store the application entries, stage statuses, offered salaries, interview dates, recruiter notes, and uploaded resume files you provide.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              2. How Your Data Is Used
            </h4>
            <p className="pl-4 text-slate-600">
              Your candidate data is used exclusively to populate your personal dashboard, track job stages across the Kanban board, trigger 7-day recruiter follow-up alerts, compute priority engine rankings, and generate downloadable Excel progress reports.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              3. User-Scoped Data Isolation &amp; Privacy Guarantee
            </h4>
            <p className="pl-4 text-slate-600">
              CareerPlus enforces strict user-scoped data isolation. Other candidates logged into CareerPlus CANNOT view, search, or access your job applications, resumes, or recruiter notes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              4. Data Retention &amp; User Control
            </h4>
            <p className="pl-4 text-slate-600">
              You retain 100% control over your data. You may delete individual applications, remove uploaded resume documents, or purge your local storage at any time.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              5. Security &amp; Encryption Standards
            </h4>
            <p className="pl-4 text-slate-600">
              All communications between your browser and the CareerPlus Spring Boot REST gateway are encrypted over standard SSL/TLS protocols with JWT token authentication.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">Last Updated: August 2026</span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I Accept &amp; Agree</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
