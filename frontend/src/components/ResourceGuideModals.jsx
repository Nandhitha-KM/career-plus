import React from 'react';
import { X, BookOpen, FileCheck, MessageSquare, DollarSign, CheckCircle2, ArrowRight, Lightbulb, Target, TrendingUp, Sparkles, Award } from 'lucide-react';

// 1. Job Search Guide Modal
export function JobSearchGuideModal({ isOpen, onClose }) {
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
              <BookOpen className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Job Search Masterclass Guide</h3>
              <p className="text-xs text-slate-500 font-medium">Proven 4-Step Strategy to Land Software &amp; Tech Roles</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3">
            <Target className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-900 font-bold">
              Consistency is key: Candidates who apply to 5-10 tailored roles weekly land 3x more recruiter callbacks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center text-rose-700">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-black mr-2">1</span>
                Targeted Role Selection &amp; Company Mapping
              </h4>
              <p className="pl-8 text-slate-600">
                Focus on roles that match 60-70% of your current tech stack. Create target lists of Tier 1, Tier 2, and high-growth startup companies in CareerPlus.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center text-rose-700">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-black mr-2">2</span>
                Tailored Application Submissions
              </h4>
              <p className="pl-8 text-slate-600">
                Customize your resume keywords for every application. Upload custom PDFs into your CareerPlus candidate profile.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center text-rose-700">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-black mr-2">3</span>
                Automated 7-Day Recruiter Follow-up
              </h4>
              <p className="pl-8 text-slate-600">
                If an application receives no response after 7 days, CareerPlus automatically highlights the card in yellow. Reach out directly to internal recruiters via LinkedIn.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Career Guides</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20 cursor-pointer">
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Resume Tips Modal
export function ResumeTipsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-emerald-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <FileCheck className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">ATS Resume Optimization Checklist</h3>
              <p className="text-xs text-slate-500 font-medium">How to Pass Automated ATS Scanners &amp; Impress Recruiters</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-900 font-bold">
              98% of Fortune 500 companies use ATS parsers. Keep formatting clean and PDF-standard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                Quantify Impact with Numbers &amp; Metrics
              </h4>
              <p className="text-slate-600">
                Instead of "Built React web application", write "Developed responsive React dashboard serving 10K+ monthly active candidates, reducing page load time by 40%".
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                Clean Single / Dual Column PDF Format
              </h4>
              <p className="text-slate-600">
                Avoid complex multi-layer graphic elements or tables that confuse parser engines. Always export standard PDF files (<code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">.pdf</code>).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                Upload &amp; View Resumes in CareerPlus Profile
              </h4>
              <p className="text-slate-600">
                Store multiple versions of your resume in CareerPlus My Profile. Click any uploaded resume document to inspect and preview it in 1 click!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Resume Standards</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
            Close Tips
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Interview Preparation Modal
export function InterviewPrepModal({ isOpen, onClose }) {
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
              <MessageSquare className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Interview Preparation Playbook</h3>
              <p className="text-xs text-slate-500 font-medium">Master Behavioral &amp; Technical Interviews with Confidence</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-900 font-bold">
              Use the STAR Framework (Situation, Task, Action, Result) for 100% of behavioral questions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">STAR Storytelling Method</h4>
              <ul className="space-y-1.5 pl-2 text-slate-600">
                <li><strong>S - Situation:</strong> Describe the context and project challenge.</li>
                <li><strong>T - Task:</strong> What specific goal were you assigned to accomplish?</li>
                <li><strong>A - Action:</strong> Details of code written, architecture designed, or problem solved.</li>
                <li><strong>R - Result:</strong> Measurable positive outcome (e.g. 25% performance boost).</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">Top Technical Interview Questions</h4>
              <p className="text-slate-600">
                Review core Data Structures &amp; Algorithms, REST API Gateway design, State Management in React, and Database Indexing principles.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Prep Playbook</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20 cursor-pointer">
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Salary Insights Modal
export function SalaryInsightsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-emerald-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <DollarSign className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Salary Benchmarks &amp; Negotiation Guide</h3>
              <p className="text-xs text-slate-500 font-medium">Real-World Tech Market Compensation &amp; Offer Evaluation</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-900 font-bold">
              Always negotiate: Candidates who counter-offer receive an average 8-15% increase in total compensation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">Tech Market Base Salary Ranges (2026)</h4>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Software Engineer (Entry / Mid):</span>
                  <strong className="text-emerald-700">₹6,50,000 - ₹14,00,000 / yr</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Full Stack / Senior Developer:</span>
                  <strong className="text-emerald-700">₹14,00,000 - ₹28,00,000 / yr</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Product Manager / Lead Engineer:</span>
                  <strong className="text-emerald-700">₹22,00,000 - ₹45,00,000 / yr</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">Excel Export Progress Report Feature</h4>
              <p className="text-slate-600">
                Use CareerPlus's 1-Click Excel Progress Report Exporter to download all offered salaries, role titles, and company locations in a formatted spreadsheet!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">CareerPlus Market Benchmarks</span>
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
}
