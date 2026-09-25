import React, { useEffect } from 'react';
import { CheckCircle2, Trash2, RotateCcw, X, Info } from 'lucide-react';

export default function ToastNotification({ toast, onClose, onUndo }) {
  useEffect(() => {
    if (toast && toast.autoClose !== false) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast || !toast.message) return null;

  const isDelete = toast.type === 'delete';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-100 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between space-x-3 backdrop-blur-md ${
        isDelete 
          ? 'bg-slate-900/95 text-white border-slate-700/80 shadow-rose-900/20' 
          : 'bg-rose-950/95 text-white border-rose-800/80 shadow-rose-950/25'
      }`}>
        <div className="flex items-center space-x-3 truncate">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
            isDelete ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isDelete ? <Trash2 className="w-4.5 h-4.5" /> : <CheckCircle2 className="w-4.5 h-4.5" />}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-extrabold tracking-wide">{toast.title || (isDelete ? 'Entry Removed' : 'Success')}</h4>
            <p className="text-[11px] opacity-90 truncate mt-0.5">{toast.message}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {onUndo && isDelete && (
            <button
              type="button"
              onClick={() => {
                onUndo();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-[11px] shadow-sm shadow-rose-500/20 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span>Undo</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
