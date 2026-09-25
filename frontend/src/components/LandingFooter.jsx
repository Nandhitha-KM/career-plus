import React from 'react';
import { Briefcase, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';

export default function LandingFooter({ 
  onOpenPrivacyModal, 
  onOpenTermsModal,
  onOpenJobSearchGuide,
  onOpenResumeTips,
  onOpenInterviewPrep,
  onOpenSalaryInsights,
  onOpenAppTracker,
  onOpenKanbanBoard,
  onOpenFollowUpReminders,
  onOpenAnalyticsDashboard
}) {
  const scrollToSection = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div 
              onClick={() => scrollToSection('top')}
              className="flex items-center space-x-2 text-white cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md shadow-rose-500/20">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Career <span className="text-rose-500">Plus</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier job &amp; internship application tracking platform. Helping job seekers stay organized and land dream offers.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="CareerPlus Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="CareerPlus LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="CareerPlus GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=careerplus.support@gmail.com&su=CareerPlus%20Candidate%20Support%20%26%20Complaint%20Request" 
                target="_blank"
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer" 
                title="Open Gmail to email support: careerplus.support@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button type="button" onClick={onOpenAppTracker} className="hover:text-white transition-colors cursor-pointer">
                  Application Tracker
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenKanbanBoard} className="hover:text-white transition-colors cursor-pointer">
                  Kanban Board
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenFollowUpReminders} className="hover:text-white transition-colors cursor-pointer">
                  Follow-up Reminders
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenAnalyticsDashboard} className="hover:text-white transition-colors cursor-pointer">
                  Analytics Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button type="button" onClick={onOpenJobSearchGuide} className="hover:text-white transition-colors cursor-pointer">
                  Job Search Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenResumeTips} className="hover:text-white transition-colors cursor-pointer">
                  Resume Tips
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenInterviewPrep} className="hover:text-white transition-colors cursor-pointer">
                  Interview Preparation
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenSalaryInsights} className="hover:text-white transition-colors cursor-pointer">
                  Salary Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button type="button" onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenPrivacyModal} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenTermsModal} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Career Plus. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
