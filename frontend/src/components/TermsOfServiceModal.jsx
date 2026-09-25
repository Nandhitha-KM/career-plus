import React from 'react';
import { X, FileText, Check, Shield, Scale, Briefcase } from 'lucide-react';

export default function TermsOfServiceModal({ isOpen, onClose, onAccept }) {
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
              <FileText className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">CareerPlus Terms of Service</h3>
              <p className="text-xs text-slate-500 font-medium">Candidate Account Agreement &amp; Platform Guidelines</p>
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
            <Scale className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-900 font-bold">
              Welcome to CareerPlus! By creating a candidate account, you agree to these terms governing your use of our application tracking system.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
              1. Acceptance of Terms
            </h4>
            <p className="pl-4 text-slate-600">
              By creating a candidate account or logging into CareerPlus, you confirm that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
              2. Candidate Account Responsibilities
            </h4>
            <p className="pl-4 text-slate-600">
              You are responsible for maintaining the security of your account credentials (email and password). You agree not to share your password or allow unauthorized third parties to access your profile.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
              3. Acceptable Use Policy
            </h4>
            <p className="pl-4 text-slate-600">
              CareerPlus is designed for personal job &amp; internship application tracking, recruiter follow-up management, and career analytics. You agree not to use the platform for fraudulent entries, automated spam, or malicious code injection.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
              4. Intellectual Property &amp; Resume Ownership
            </h4>
            <p className="pl-4 text-slate-600">
              You retain 100% full ownership of all resume documents, notes, and application content uploaded to your profile. CareerPlus claims no intellectual property rights over your candidate documents.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-2"></span>
              5. Service Modifications
            </h4>
            <p className="pl-4 text-slate-600">
              CareerPlus continuously enhances features, such as priority algorithms, recruiter alert rules, and progress report exporters, to assist job seekers in landing career offers.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">Effective Date: August 2026</span>

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
