import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';

export default function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  currentUser
}) {
  if (!isOpen) return null;

  const userName = currentUser?.fullName || currentUser?.name || 'Candidate';
  const userEmail = currentUser?.email || '';

  return (
    <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <LogOut className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Log Out of Career Plus?
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Confirm your sign out
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card Info */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">
              {userName}
            </p>
            {userEmail && (
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {userEmail}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to end your current session? Your applications, notes, and progress are saved and will be available when you sign in again.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/25 flex items-center space-x-1.5 cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
