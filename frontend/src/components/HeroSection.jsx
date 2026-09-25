import React from 'react';
import { ArrowRight, LogIn, CheckCircle2, ShieldCheck, Sparkles, LayoutDashboard, Briefcase } from 'lucide-react';

export default function HeroSection({ currentUser, onGetStarted, onLogin }) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-rose-50/70 via-[#FFF5F7] to-white">
      
      {/* Background Mobility Ambient Blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-rose-500/15 via-pink-400/15 to-rose-300/15 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-900 text-xs font-black tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>#1 Job &amp; Internship Application Workspace</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Track Every Application. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Land Your Dream Career.
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Organize your job hunt seamlessly in one central workspace. Track applications, schedule interviews, set follow-up reminders, and analyze your offer metrics with ease.
          </p>

          {/* Prominent Action Buttons - Conditional for Logged-In User */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <>
                {/* Explore Dashboard Button for Logged-in Candidate */}
                <button
                  type="button"
                  id="hero-explore-dashboard-btn"
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-base shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* View Applications Secondary Button */}
                <button
                  type="button"
                  id="hero-view-apps-btn"
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-rose-50/50 text-slate-800 font-extrabold text-base border border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Briefcase className="w-4.5 h-4.5 text-rose-600" />
                  <span>View Applications</span>
                </button>
              </>
            ) : (
              <>
                {/* Get Started Button for New Users */}
                <button
                  type="button"
                  id="hero-get-started-btn"
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-base shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Login Account Button */}
                <button
                  type="button"
                  id="hero-login-btn"
                  onClick={onLogin}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-rose-50/50 text-slate-800 font-extrabold text-base border border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-4.5 h-4.5 text-rose-600" />
                  <span>Login Account</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
