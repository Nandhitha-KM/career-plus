import React from 'react';
import { Briefcase, LogIn, UserPlus, Sparkles, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function LandingNavbar({ currentUser, onNavigateDashboard, onNavigateLogin, onNavigateSignUp, onLogout }) {
  const userName = currentUser?.fullName || currentUser?.name || 'Candidate';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateDashboard}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-600/25 transform hover:scale-105 transition-transform">
              <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Career<span className="text-rose-600 font-extrabold">Plus</span>
                </span>
                <span className="bg-rose-50 text-rose-800 border border-rose-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                  <Sparkles className="w-3 h-3 mr-0.5 text-rose-600" /> Tracker
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Job &amp; Internship Application Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
            <a href="#home" className="hover:text-rose-700 transition-colors">Home</a>
            <a href="#features" className="hover:text-rose-700 transition-colors">Features</a>
            <a href="#about" className="hover:text-rose-700 transition-colors">About</a>
            <a href="#contact" className="hover:text-rose-700 transition-colors">Contact</a>
          </nav>

          {/* CTA Buttons - Conditional Header for Authenticated vs Unauthenticated Users */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                {/* User Profile Badge */}
                <div 
                  onClick={onNavigateDashboard}
                  className="flex items-center space-x-2 bg-rose-50/80 border border-rose-200/80 px-3 py-1.5 rounded-2xl cursor-pointer hover:bg-rose-100/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {userInitial}
                  </div>
                  <span className="text-xs font-bold text-rose-950 hidden sm:inline">{userName}</span>
                </div>

                {/* Primary "Go to Dashboard" Action Button */}
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-600/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                  <span>Go to Dashboard</span>
                </button>

                {/* Explicit Logout Button */}
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Logout Account"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-rose-700 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  <span>Sign In</span>
                </button>

                {/* Sign Up Free Button */}
                <button
                  type="button"
                  onClick={onNavigateSignUp}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-600/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  <span>Sign Up Free</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
