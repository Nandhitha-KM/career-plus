import React, { useState } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import LandingFooter from '../components/LandingFooter';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../components/TermsOfServiceModal';
import { JobSearchGuideModal, ResumeTipsModal, InterviewPrepModal, SalaryInsightsModal } from '../components/ResourceGuideModals';
import { ApplicationTrackerModal, KanbanBoardFeatureModal, FollowUpSystemModal, AnalyticsEngineModal } from '../components/ProductFeatureModals';

export default function LandingPage({ currentUser, onNavigateDashboard, onNavigateLogin, onNavigateSignUp, onLogout }) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showJobSearchGuide, setShowJobSearchGuide] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [showSalaryInsights, setShowSalaryInsights] = useState(false);

  // Product Feature Modals State
  const [showAppTracker, setShowAppTracker] = useState(false);
  const [showKanbanBoard, setShowKanbanBoard] = useState(false);
  const [showFollowUpReminders, setShowFollowUpReminders] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-900 font-sans selection:bg-rose-600 selection:text-white">
      {/* Navigation Bar */}
      <LandingNavbar 
        currentUser={currentUser}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <HeroSection 
        currentUser={currentUser}
        onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp}
        onLogin={currentUser ? onNavigateDashboard : onNavigateLogin}
      />

      {/* Showcase Features Section (4 Cards) */}
      <FeaturesSection 
        onOpenAppTracker={() => setShowAppTracker(true)}
        onOpenKanbanBoard={() => setShowKanbanBoard(true)}
        onOpenFollowUpReminders={() => setShowFollowUpReminders(true)}
        onOpenAnalyticsDashboard={() => setShowAnalyticsDashboard(true)}
      />

      {/* About Section */}
      <AboutSection onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp} />

      {/* Contact Section */}
      <ContactSection onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp} />

      {/* Footer */}
      <LandingFooter 
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        onOpenTermsModal={() => setShowTermsModal(true)}
        onOpenJobSearchGuide={() => setShowJobSearchGuide(true)}
        onOpenResumeTips={() => setShowResumeTips(true)}
        onOpenInterviewPrep={() => setShowInterviewPrep(true)}
        onOpenSalaryInsights={() => setShowSalaryInsights(true)}
        onOpenAppTracker={() => setShowAppTracker(true)}
        onOpenKanbanBoard={() => setShowKanbanBoard(true)}
        onOpenFollowUpReminders={() => setShowFollowUpReminders(true)}
        onOpenAnalyticsDashboard={() => setShowAnalyticsDashboard(true)}
      />

      {/* Legal Modals */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* 4 Resource Modals */}
      <JobSearchGuideModal
        isOpen={showJobSearchGuide}
        onClose={() => setShowJobSearchGuide(false)}
      />

      <ResumeTipsModal
        isOpen={showResumeTips}
        onClose={() => setShowResumeTips(false)}
      />

      <InterviewPrepModal
        isOpen={showInterviewPrep}
        onClose={() => setShowInterviewPrep(false)}
      />

      <SalaryInsightsModal
        isOpen={showSalaryInsights}
        onClose={() => setShowSalaryInsights(false)}
      />

      {/* 4 Product Feature Modals */}
      <ApplicationTrackerModal
        isOpen={showAppTracker}
        onClose={() => setShowAppTracker(false)}
      />

      <KanbanBoardFeatureModal
        isOpen={showKanbanBoard}
        onClose={() => setShowKanbanBoard(false)}
      />

      <FollowUpSystemModal
        isOpen={showFollowUpReminders}
        onClose={() => setShowFollowUpReminders(false)}
      />

      <AnalyticsEngineModal
        isOpen={showAnalyticsDashboard}
        onClose={() => setShowAnalyticsDashboard(false)}
      />
    </div>
  );
}
