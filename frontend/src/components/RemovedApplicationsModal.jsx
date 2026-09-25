import React, { useState } from 'react';
import { X, Trash2, RotateCcw, Building2, Briefcase, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function RemovedApplicationsModal({ isOpen, onClose, removedJobs, onRestoreJob, onPermanentDeleteJob }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

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
              <Trash2 className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Removed &amp; Archived Entries</h3>
              <p className="text-xs text-slate-500 font-medium">View removed job applications &amp; restore them anytime</p>
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
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {(!removedJobs || removedJobs.length === 0) ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Removed Applications</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                When you click "Remove Entry" on any application card, it will be safely stored here so you can view or restore it.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {removedJobs.map((job) => {
                const company = job.companyName || job.company || 'Company';
                const title = job.jobTitle || job.title || 'Untitled Role';

                return (
                  <div 
                    key={job.id} 
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                        {company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{company}</h4>
                        <p className="text-xs font-semibold text-slate-600">{title}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                          <span>Stage: <strong className="uppercase text-slate-700">{job.status || 'Applied'}</strong></span>
                          <span>•</span>
                          <span>Removed Entry</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => onRestoreJob(job.id)}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                        title="Restore Application to active Kanban board"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: job.id, company })}
                        className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Permanently Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Total Removed Entries: <strong>{removedJobs ? removedJobs.length : 0}</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Trash Bin
          </button>
        </div>

      </div>

      {/* Custom Confirmation Modal for Permanent Delete */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onPermanentDeleteJob(deleteTarget.id);
        }}
        title="Permanently Delete Application Entry?"
        message={`Are you sure you want to permanently delete the entry for ${deleteTarget?.company || 'this company'}? This action cannot be undone.`}
        confirmText="Yes, Delete Permanently"
      />
    </div>
  );
}
