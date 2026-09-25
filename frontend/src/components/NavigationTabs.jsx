import React from 'react';
import { LayoutGrid, CalendarCheck, Clock, Zap, Bell, BarChart3, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

const formatDateString = (dateVal) => {
  if (!dateVal || dateVal === 'Recently' || dateVal === 'N/A' || dateVal === 'None Set') return '';
  let str = String(dateVal).trim();
  let timestamp = Number(str);
  if (!isNaN(timestamp) && timestamp > 1000000000) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return str;
};

export default function NavigationTabs({ activeTab, setActiveTab, jobs = [] }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Applications with reminder due today or overdue
  const todaysDueCount = jobs.filter(j => {
    const reminderRaw = j.reminderDate || j.followUpDate;
    if (!reminderRaw) return false;
    const formatted = formatDateString(reminderRaw);
    return formatted && formatted <= todayStr;
  }).length;

  // Applications inactive > 7 days (recruiter follow-up)
  const followUpDueCount = jobs.filter(j => {
    const status = (j.status || 'applied').toLowerCase().trim();
    if (status === 'offered' || status === 'rejected') return false;
    const dateVal = j.lastStatusChangeDate || j.updatedAt || j.appliedDate || j.dateApplied || j.createdAt;
    if (!dateVal || dateVal === 'Recently') return false;
    let str = String(dateVal).trim();
    let timestamp = Number(str);
    let timeMs = !isNaN(timestamp) && timestamp > 1000000000 ? timestamp : new Date(str).getTime();
    if (isNaN(timeMs)) return false;
    const diffDays = Math.floor((Date.now() - timeMs) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }).length;

  const tabs = [
    { id: 'kanban', label: 'Kanban Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { 
      id: 'todays-list', 
      label: "Today's List", 
      icon: <CalendarCheck className="w-4 h-4 text-rose-300 animate-pulse" />,
      badge: todaysDueCount > 0 ? `${todaysDueCount} Due` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { 
      id: 'ai-matcher', 
      label: 'AI Role Matcher', 
      icon: <Sparkles className="w-4 h-4 text-rose-300 animate-pulse" />,
      badge: '✨ AI Match',
      badgeColor: 'bg-amber-400 text-slate-900'
    },
    { id: 'priority', label: 'Priority Engine', icon: <Zap className="w-4 h-4" /> },
    { 
      id: 'reminders', 
      label: 'Follow-ups (>7d)', 
      icon: <Clock className="w-4 h-4 text-amber-300" />,
      badge: followUpDueCount > 0 ? `${followUpDueCount} Due` : null,
      badgeColor: 'bg-amber-400 text-slate-900'
    },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    
    // Trigger REST API call through API Gateway (Port 8080) -> Microservice Port 8082
    try {
      if (tabId === 'kanban') {
        await apiService.getKanbanApplications();
      } else if (tabId === 'priority') {
        await apiService.getPriorityApplications();
      } else if (tabId === 'reminders' || tabId === 'todays-list') {
        await apiService.getFollowUpApplications();
      } else if (tabId === 'analytics') {
        await apiService.getAnalyticsInsights();
      } else if (tabId === 'ai-matcher') {
        await apiService.getResumes();
      }
    } catch (err) {
      console.warn(`REST API call for ${tabId} tab:`, err.message);
    }
  };

  return (
    <div className="bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 min-w-max py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer relative ${
              isActive
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]'
                : tab.badge 
                ? 'bg-gradient-to-r from-rose-950 to-pink-950 text-white shadow-sm hover:opacity-95'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tab.badgeColor || 'bg-amber-400 text-slate-900'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
