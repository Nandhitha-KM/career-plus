import React from 'react';
import { Layers, Kanban, Bell, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturesSection({
  onOpenAppTracker,
  onOpenKanbanBoard,
  onOpenFollowUpReminders,
  onOpenAnalyticsDashboard
}) {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-rose-600" />,
      bgIcon: 'bg-rose-100/80 border-rose-300/80 text-rose-700 shadow-rose-500/15',
      accentColor: 'group-hover:border-rose-400 group-hover:shadow-rose-600/10',
      titleColor: 'group-hover:text-rose-600',
      linkColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      title: 'Application Tracking',
      description: 'Effortlessly log job titles, company names, salaries in LPA, locations, and submission dates in one structured workspace.',
      badge: 'Core Feature',
      onClick: onOpenAppTracker
    },
    {
      icon: <Kanban className="w-6 h-6 text-pink-600" />,
      bgIcon: 'bg-pink-100/80 border-pink-300/80 text-pink-700 shadow-pink-500/15',
      accentColor: 'group-hover:border-pink-400 group-hover:shadow-pink-600/10',
      titleColor: 'group-hover:text-pink-600',
      linkColor: 'text-pink-600',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
      title: 'Status Management',
      description: 'Intuitive Kanban board workflow allowing you to move applications across Applied, Interviewing, Offered, and Rejected stages.',
      badge: 'Visual Workflow',
      onClick: onOpenKanbanBoard
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-600" />,
      bgIcon: 'bg-amber-100/80 border-amber-300/80 text-amber-700 shadow-amber-500/15',
      accentColor: 'group-hover:border-amber-400 group-hover:shadow-amber-600/10',
      titleColor: 'group-hover:text-amber-600',
      linkColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Follow-up Reminders',
      description: 'Set smart notifications and task alerts for recruiter follow-ups, interview schedules, and technical assessment deadlines.',
      badge: 'Smart Alerts',
      onClick: onOpenFollowUpReminders
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-700" />,
      bgIcon: 'bg-rose-100/80 border-rose-300/80 text-rose-800 shadow-rose-500/15',
      accentColor: 'group-hover:border-rose-400 group-hover:shadow-rose-600/10',
      titleColor: 'group-hover:text-rose-700',
      linkColor: 'text-rose-700',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
      title: 'Application Analytics',
      description: 'Gain actionable insights into your job search with response rate metrics, interview conversion stats, and offer comparisons.',
      badge: 'Insights',
      onClick: onOpenAnalyticsDashboard
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white via-rose-50/30 to-white relative overflow-hidden">
      
      {/* Mobility Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-800 bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs inline-flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-rose-600 animate-pulse" />
            <span>POWERFUL FEATURES</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Everything You Need to Master Your Job Search
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Supercharge your application process with tools tailored for modern job seekers, students, and tech professionals.
          </p>
        </div>

        {/* 4 Feature Cards Grid with Mobility & Glassmorphism Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onClick={feat.onClick}
              className={`group glass-card rounded-3xl p-7 border border-slate-200/90 shadow-sm ${feat.accentColor} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between cursor-pointer`}
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border ${feat.bgIcon} transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-md`}>
                    {feat.icon}
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs ${feat.badgeBg}`}>
                    {feat.badge}
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className={`text-xl font-extrabold text-slate-900 mb-3 ${feat.titleColor} transition-colors`}>
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-black ${feat.linkColor} group-hover:translate-x-1 transition-transform`}>
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
