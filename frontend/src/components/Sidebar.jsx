import React from 'react';
import { 
  LayoutGrid, 
  CalendarCheck, 
  Clock, 
  Zap, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Layers
} from 'lucide-react';
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

export default function Sidebar({
  activeTab,
  setActiveTab,
  jobs = [],
  removedJobsCount = 0,
  onOpenRemovedModal,
  onOpenAddModal,
  onExportExcel,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) {
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

  const menuItems = [
    { 
      id: 'kanban', 
      label: 'Kanban Board', 
      icon: LayoutGrid,
      desc: 'Visual stage workflow'
    },
    { 
      id: 'todays-list', 
      label: "Today's List", 
      icon: CalendarCheck,
      desc: 'Reminders & actions due',
      badge: todaysDueCount > 0 ? `${todaysDueCount} Due` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { 
      id: 'ai-matcher', 
      label: 'AI Role Matcher', 
      icon: Sparkles,
      desc: 'Smart resume matching',
      badge: '✨ AI Match',
      badgeColor: 'bg-amber-400 text-slate-900 font-black'
    },
    { 
      id: 'priority', 
      label: 'Priority Engine', 
      icon: Zap,
      desc: 'Urgency & scoring matrix'
    },
    { 
      id: 'reminders', 
      label: 'Follow-ups (>7d)', 
      icon: Clock,
      desc: 'Stale application alerts',
      badge: followUpDueCount > 0 ? `${followUpDueCount} Due` : null,
      badgeColor: 'bg-amber-400 text-slate-900 font-bold'
    },
    { 
      id: 'analytics', 
      label: 'Analytics & Insights', 
      icon: BarChart3,
      desc: 'Performance metrics'
    },
  ];

  const handleItemClick = async (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
    
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

  const renderContent = (collapsed = false) => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header / Section Tag */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200/80 mb-2">
        {!collapsed ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Workspace Menu
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* Collapse toggle button on desktop */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center justify-center p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ${
              collapsed ? 'w-full mt-1' : ''
            }`}
            title={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        )}
      </div>

      {/* Main Navigation Menu List */}
      <nav className="flex-1 space-y-1.5 px-1.5 overflow-y-auto custom-scrollbar" aria-label="Sidebar Menu Navigation">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              title={collapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : item.label}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer text-left group relative ${
                collapsed 
                  ? 'justify-center p-2.5 my-1' 
                  : 'px-3 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/25 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 font-bold'
              }`}
            >
              {/* Icon */}
              <span className={`shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-rose-600'
              }`}>
                <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
              </span>

              {/* Label & Description (when expanded) */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-tight truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                        isActive ? 'bg-white/25 text-white' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Dot badge indicator when collapsed */}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer & Utilities */}
      <div className="pt-3 mt-2 border-t border-slate-200/80 px-1.5 space-y-2">
        {!collapsed && (
          <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Quick Actions
          </span>
        )}

        {/* Primary Action: Add Application Button */}
        {onOpenAddModal && (
          <button
            type="button"
            onClick={() => {
              onOpenAddModal();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Add Application"
            className={`w-full flex items-center rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-black transition-all cursor-pointer ${
              collapsed 
                ? 'justify-center p-2.5' 
                : 'px-3 py-2 space-x-2 text-xs'
            }`}
          >
            <Plus className="w-4 h-4 text-rose-600 stroke-[3] shrink-0" />
            {!collapsed && <span>Add Application</span>}
          </button>
        )}

        {/* Removed / Archived Applications */}
        {onOpenRemovedModal && (
          <button
            type="button"
            onClick={() => {
              onOpenRemovedModal();
              if (onCloseMobile) onCloseMobile();
            }}
            title={`Removed Applications (${removedJobsCount})`}
            className={`w-full flex items-center rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer ${
              collapsed 
                ? 'justify-center p-2.5 relative' 
                : 'px-3 py-2 space-x-2 text-xs'
            }`}
          >
            <Trash2 className="w-4 h-4 text-slate-500 stroke-[2] shrink-0" />
            {!collapsed ? (
              <div className="flex items-center justify-between w-full">
                <span className="truncate">Removed Bin</span>
                {removedJobsCount > 0 && (
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-extrabold">
                    {removedJobsCount}
                  </span>
                )}
              </div>
            ) : (
              removedJobsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-400" />
              )
            )}
          </button>
        )}

        {/* Export Progress Report */}
        {onExportExcel && (
          <button
            type="button"
            onClick={() => {
              onExportExcel();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Export Applications Report (Excel)"
            className={`w-full flex items-center rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer ${
              collapsed 
                ? 'justify-center p-2.5' 
                : 'px-3 py-2 space-x-2 text-xs'
            }`}
          >
            <Download className="w-4 h-4 text-slate-500 stroke-[2] shrink-0" />
            {!collapsed && <span className="truncate">Export Report</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar Menu Bar */}
      <aside 
        className={`hidden lg:block shrink-0 bg-white border-r border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] p-3 transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer (Slide-Over Backdrop + Sidebar) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
          />

          {/* Drawer Body */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white border-r border-slate-200 h-full p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Close Button */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Menu Navigation
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {renderContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
