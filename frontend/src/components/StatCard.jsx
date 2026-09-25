import React from 'react';
import { Send, Calendar, Award, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, count, change, isPositive, iconType, colorTheme }) {
  // Theme color maps
  const themeStyles = {
    blue: {
      bgIcon: 'bg-sky-50 text-sky-600 border-sky-200/80',
      badgeBg: 'bg-sky-50 text-sky-700',
      glow: 'group-hover:border-sky-300 group-hover:shadow-sky-500/10'
    },
    sky: {
      bgIcon: 'bg-sky-50 text-sky-600 border-sky-200/80',
      badgeBg: 'bg-sky-50 text-sky-700',
      glow: 'group-hover:border-sky-300 group-hover:shadow-sky-500/10'
    },
    teal: {
      bgIcon: 'bg-teal-50 text-teal-600 border-teal-200/80',
      badgeBg: 'bg-teal-50 text-teal-700',
      glow: 'group-hover:border-teal-300 group-hover:shadow-teal-500/10'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-200/80',
      badgeBg: 'bg-amber-50 text-amber-700',
      glow: 'group-hover:border-amber-300 group-hover:shadow-amber-500/10'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      glow: 'group-hover:border-emerald-300 group-hover:shadow-emerald-500/10'
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-200/80',
      badgeBg: 'bg-rose-50 text-rose-700',
      glow: 'group-hover:border-rose-300 group-hover:shadow-rose-500/10'
    }
  };

  const style = themeStyles[colorTheme] || themeStyles.rose;

  const renderIcon = () => {
    switch (iconType) {
      case 'total':
        return <Send className="w-5 h-5" />;
      case 'interview':
        return <Calendar className="w-5 h-5" />;
      case 'offer':
        return <Award className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Send className="w-5 h-5" />;
    }
  };

  return (
    <div className={`group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden ${style.glow}`}>
      
      {/* Subtle top border accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        (colorTheme === 'blue' || colorTheme === 'sky') ? 'bg-sky-500' :
        colorTheme === 'amber' ? 'bg-amber-500' :
        colorTheme === 'teal' ? 'bg-teal-500' :
        colorTheme === 'emerald' ? 'bg-emerald-500' :
        colorTheme === 'rose' ? 'bg-rose-500' : 'bg-rose-500'
      } opacity-80 group-hover:opacity-100 transition-opacity`}></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{count}</h3>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${style.bgIcon} transition-transform group-hover:scale-110`}>
          {renderIcon()}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-1 font-medium">
          {isPositive ? (
            <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          ) : (
            <span className="inline-flex items-center text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      </div>

    </div>
  );
}
