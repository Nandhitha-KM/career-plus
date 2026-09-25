import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import SearchBar from './components/SearchBar';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import TodaysListView from './components/TodaysListView';
import PriorityEngineView from './components/PriorityEngineView';
import FollowUpNotesView from './components/FollowUpNotesView';
import AnalyticsView from './components/AnalyticsView';
import AiRoleMatcherView from './components/AiRoleMatcherView';
import AddApplicationModal from './components/AddApplicationModal';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import UserProfileModal from './components/UserProfileModal';
import RemovedApplicationsModal from './components/RemovedApplicationsModal';
import ConfirmLogoutModal from './components/ConfirmLogoutModal';
import ToastNotification from './components/ToastNotification';
import { apiService } from './services/api';
import { getInitialUserJobs, getInitialUserResumes } from './data/initialData';
import { Download, Trash2, RotateCcw } from 'lucide-react';

// Helper function to normalize job objects for seamless UI rendering
const normalizeJob = (j) => {
  if (!j || typeof j !== 'object') return null;
  try {
    const company = (j.companyName || j.company || 'Company').toString();
    const title = (j.jobTitle || j.title || 'Untitled Role').toString();
    const status = (j.status ? String(j.status) : 'applied').toLowerCase().trim();
    
    let tags = [];
    if (typeof j.skillsRequired === 'string' && j.skillsRequired.trim()) {
      tags = j.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(j.tags)) {
      tags = j.tags.map(t => String(t).trim()).filter(Boolean);
    } else {
      tags = [j.applicationType ? String(j.applicationType) : 'Full-time'];
    }

    return {
      ...j,
      id: j.id || 'job-' + Math.random(),
      title,
      jobTitle: title,
      company,
      companyName: company,
      status,
      tags,
      logo: company.charAt(0).toUpperCase(),
      location: j.location ? String(j.location) : 'Remote',
      appliedDate: j.appliedDate ? String(j.appliedDate) : 'Recently',
      workMode: j.workMode ? String(j.workMode) : 'Remote',
      applicationType: j.applicationType ? String(j.applicationType) : 'Full-time',
      reminderDate: j.reminderDate ? String(j.reminderDate) : (j.followUpDate ? String(j.followUpDate) : ''),
      followUpDate: j.reminderDate ? String(j.reminderDate) : (j.followUpDate ? String(j.followUpDate) : '')
    };
  } catch(err) {
    console.warn('Skipping unparseable job item:', j, err);
    return null;
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI Error Boundary caught an exception:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full space-y-4">
            <h2 className="text-xl font-black text-slate-900">Application Dashboard Active</h2>
            <p className="text-xs text-slate-600 font-medium">Click below to refresh and view your application updates.</p>
            <button
              onClick={() => {
                try {
                  const savedUser = localStorage.getItem('careerplus_user');
                  if (savedUser) {
                    const u = JSON.parse(savedUser);
                    const k = (u.email || u.name || u.id || 'guest').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
                    localStorage.removeItem(`careerplus_jobs_${k}`);
                  }
                  localStorage.removeItem('careerplus_jobs');
                } catch(e) {}
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppMain() {
  // Authenticated User State (Persistent Session)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('careerplus_user');
    const savedToken = localStorage.getItem('careerplus_jwt_token');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return savedToken ? { name: 'Candidate Profile', email: 'user@careerplus.io' } : null;
  });

  // Views: 'landing' | 'signup' | 'login' | 'dashboard' (Persistent Dashboard View if Logged In)
  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('careerplus_user');
    const savedToken = localStorage.getItem('careerplus_jwt_token');
    return (savedUser || savedToken) ? 'dashboard' : 'landing';
  });

  const [activeTab, setActiveTab] = useState('kanban'); // kanban | actions | priority | reminders | analytics
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'applied' | 'interviewing' | 'offered' | 'rejected'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'company-asc' | 'company-desc' | 'role-asc' | 'salary-desc' | 'salary-asc' | 'priority'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting'); // connecting | connected | offline

  const getUserKey = (user) => {
    if (!user) return 'guest';
    const rawEmail = user.email ? String(user.email).trim().toLowerCase() : '';
    const rawName = user.fullName || user.name ? String(user.fullName || user.name).trim().toLowerCase() : '';
    const rawId = user.id ? String(user.id).trim().toLowerCase() : '';

    const primary = (rawEmail && rawEmail.includes('@')) ? rawEmail : (rawName || rawEmail || rawId || 'guest');
    return primary.replace(/[^a-z0-9]/g, '_');
  };

  // Helper to load jobs for a given user
  const loadUserJobs = (user) => {
    if (!user) return [];
    const key = getUserKey(user);
    const uEmail = user.email ? String(user.email).toLowerCase().trim() : '';
    const uName = user.name || user.fullName ? String(user.name || user.fullName).toLowerCase().trim() : '';

    const saved = localStorage.getItem(`careerplus_jobs_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(j => {
            try { return normalizeJob(j); } catch(e) { return null; }
          }).filter(Boolean);
        }
      } catch (e) {}
    }

    // If user is Harniya (legacy session), migrate old single key
    if (uEmail.includes('harniya') || uName.includes('harniya')) {
      const oldSaved = localStorage.getItem('careerplus_jobs');
      if (oldSaved) {
        try {
          const parsedOld = JSON.parse(oldSaved);
          const normalizedOld = Array.isArray(parsedOld) ? parsedOld.map(j => {
            try { return normalizeJob(j); } catch(e) { return null; }
          }).filter(Boolean) : [];
          if (normalizedOld.length > 0) {
            localStorage.setItem(`careerplus_jobs_${key}`, JSON.stringify(normalizedOld));
            return normalizedOld;
          }
        } catch (e) {}
      }
    }

    // Hydrate from initial seed applications for this user
    const initialApps = getInitialUserJobs(key, uEmail);
    if (initialApps && initialApps.length > 0) {
      const normalizedInit = initialApps.map(normalizeJob).filter(Boolean);
      localStorage.setItem(`careerplus_jobs_${key}`, JSON.stringify(normalizedInit));
      return normalizedInit;
    }

    return [];
  };

  // Helper to load resumes for a given user (STRICTLY returns resumes actually uploaded by user)
  const loadUserResumes = (user) => {
    if (!user) return [];
    const key = getUserKey(user);
    const uEmail = user.email ? String(user.email).toLowerCase().trim() : '';
    const saved = localStorage.getItem(`careerplus_resumes_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleanUserResumes = parsed.filter(r => 
            r && r.id !== 'res-1' && 
            !String(r.id).includes('default') && 
            !(r.title && String(r.title).toLowerCase().includes('candidate resume') && !r.fileName)
          );
          if (cleanUserResumes.length > 0) {
            return cleanUserResumes;
          }
        }
      } catch (e) {}
    }

    // Hydrate from initial seed resumes for this user
    const initialRes = getInitialUserResumes(key, uEmail);
    if (initialRes && initialRes.length > 0) {
      localStorage.setItem(`careerplus_resumes_${key}`, JSON.stringify(initialRes));
      return initialRes;
    }

    return [];
  };

  // Helper to load user-scoped removed jobs from localStorage
  const loadUserRemovedJobs = (user) => {
    if (!user) return [];
    const key = getUserKey(user);
    const saved = localStorage.getItem(`careerplus_removed_jobs_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.map(normalizeJob).filter(Boolean);
      } catch (e) {}
    }
    return [];
  };

  // Candidate Resumes State
  const [userResumes, setUserResumes] = useState(() => loadUserResumes(currentUser));

  // Jobs Applications State
  const [jobs, setJobs] = useState(() => loadUserJobs(currentUser));

  // Removed / Archived Jobs Applications State
  const [removedJobs, setRemovedJobs] = useState(() => loadUserRemovedJobs(currentUser));
  const [isRemovedModalOpen, setIsRemovedModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Reload jobs & resumes whenever currentUser changes (Login / Logout / Switch User)
  useEffect(() => {
    setJobs(loadUserJobs(currentUser));
    setUserResumes(loadUserResumes(currentUser));
    setRemovedJobs(loadUserRemovedJobs(currentUser));
    setSelectedJob(null);
    setEditingJob(null);
  }, [currentUser?.email, currentUser?.id, currentUser?.name]);

  // Fetch live applications & resumes from backend Port 8080 on dashboard mount
  useEffect(() => {
    if (currentView === 'dashboard' && currentUser) {
      const loadBackendData = async () => {
        setBackendStatus('connecting');
        const userEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';
        const userName = (currentUser.name || currentUser.fullName ? (currentUser.name || currentUser.fullName) : '').toLowerCase().trim();
        const userKey = getUserKey(currentUser);

        const remoteApps = await apiService.getApplications(userKey, userEmail);
        const remoteResumes = await apiService.getResumes(userKey, userEmail);

        if (remoteApps && Array.isArray(remoteApps) && remoteApps.length > 0) {
          const userPrefix = userEmail.includes('@') ? userEmail.split('@')[0] : (userKey ? userKey.split('_')[0] : '');

          // Match applications for this user
          const userRemoteApps = remoteApps.filter(app => {
            if (!app) return false;
            const appEmail = (app.userEmail || '').toLowerCase().trim();
            const appKey = (app.userKey || '').toLowerCase().trim();
            const appPrefix = appEmail.includes('@') ? appEmail.split('@')[0] : (appKey ? appKey.split('_')[0] : '');

            if (userEmail && appEmail === userEmail) return true;
            if (userKey && appKey === userKey) return true;
            if (userPrefix && appPrefix && (appPrefix === userPrefix || appPrefix.startsWith(userPrefix) || userPrefix.startsWith(appPrefix))) return true;
            if (userName && appEmail && appEmail.includes(userName)) return true;
            return false;
          });

          if (userRemoteApps.length > 0) {
            const normalizedApps = userRemoteApps.map(normalizeJob).filter(Boolean);
            setJobs(prevJobs => {
              const mergedMap = new Map();
              normalizedApps.forEach(j => mergedMap.set(String(j.id), j));
              (prevJobs || []).forEach(j => {
                if (!mergedMap.has(String(j.id))) {
                  mergedMap.set(String(j.id), j);
                }
              });
              const finalJobs = Array.from(mergedMap.values());
              localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(finalJobs));
              return finalJobs;
            });
          }
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }

        if (remoteResumes && Array.isArray(remoteResumes) && remoteResumes.length > 0) {
          const userPrefix = userEmail.includes('@') ? userEmail.split('@')[0] : (userKey ? userKey.split('_')[0] : '');
          const userRemoteResumes = remoteResumes.filter(r => {
            if (!r) return false;
            const rEmail = (r.userEmail || '').toLowerCase().trim();
            const rKey = (r.userKey || '').toLowerCase().trim();
            const rPrefix = rEmail.includes('@') ? rEmail.split('@')[0] : (rKey ? rKey.split('_')[0] : '');

            if (userEmail && rEmail === userEmail) return true;
            if (userKey && rKey === userKey) return true;
            if (userPrefix && rPrefix && (rPrefix === userPrefix || rPrefix.startsWith(userPrefix) || userPrefix.startsWith(rPrefix))) return true;
            return false;
          });

          if (userRemoteResumes.length > 0) {
            setUserResumes(userRemoteResumes);
            localStorage.setItem(`careerplus_resumes_${userKey}`, JSON.stringify(userRemoteResumes));
          }
        }
      };

      loadBackendData();
    }
  }, [currentView, currentUser?.email, currentUser?.name, currentUser?.id]);

  // Save jobs to user-scoped localStorage key
  useEffect(() => {
    if (currentUser) {
      const key = getUserKey(currentUser);
      localStorage.setItem(`careerplus_jobs_${key}`, JSON.stringify(jobs));
    }
  }, [jobs, currentUser]);

  // Save resumes to user-scoped localStorage key
  useEffect(() => {
    if (currentUser) {
      const key = getUserKey(currentUser);
      localStorage.setItem(`careerplus_resumes_${key}`, JSON.stringify(userResumes));
    }
  }, [userResumes, currentUser]);

  // Resume handlers synced with Spring Boot 8080
  const handleAddResume = async (newResume) => {
    setUserResumes(prev => [newResume, ...prev]);
    await apiService.createResume(newResume);
  };

  const handleDeleteResume = async (resumeId) => {
    setUserResumes(prev => prev.filter(r => r.id !== resumeId));
    await apiService.deleteResume(resumeId);
  };

  // Navigate to Dashboard & set user
  const handleAuthenticated = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      localStorage.setItem('careerplus_user', JSON.stringify(userData));
    }
    setCurrentView('dashboard');
  };

  // Add / Edit application job card handler synced with Spring Boot 8080
  const handleSaveJob = async (jobPayload) => {
    const userEmail = currentUser?.email || currentUser?.name || 'user@careerplus.io';
    const userKey = getUserKey(currentUser);
    const newJobId = jobPayload.id || 'job-' + Date.now();

    const normalizedPayload = {
      ...normalizeJob(jobPayload),
      id: newJobId,
      userEmail: userEmail,
      userKey: userKey
    };

    if (editingJob) {
      // EDIT MODE: Update existing job
      const updatedId = editingJob.id;
      setJobs(prev => {
        const next = prev.map(j => String(j.id) === String(updatedId) ? { ...normalizedPayload, id: updatedId } : j);
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(next));
        return next;
      });
      if (selectedJob && String(selectedJob.id) === String(updatedId)) {
        setSelectedJob({ ...normalizedPayload, id: updatedId });
      }
      setEditingJob(null);
      await apiService.updateApplication(updatedId, normalizedPayload);
    } else {
      // CREATE MODE: Add new job for this specific user
      setJobs(prev => {
        const filtered = prev.filter(j => String(j.id) !== String(newJobId));
        const next = [normalizedPayload, ...filtered];
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(next));
        return next;
      });

      try {
        await apiService.createApplication(normalizedPayload);
      } catch (err) {
        console.warn('Remote sync warning:', err);
      }
    }
  };

  // Open Edit Mode Modal
  const handleOpenEditModal = (jobToEdit) => {
    setSelectedJob(null);
    setEditingJob(jobToEdit);
    setIsAddModalOpen(true);
  };

  // Open Add Mode Modal
  const handleOpenAddModal = () => {
    setEditingJob(null);
    setIsAddModalOpen(true);
  };

  // Update application status synced with Spring Boot 8080 & localStorage persistence
  const handleUpdateStatus = async (jobId, newStatus, customDate) => {
    const cleanStatus = (newStatus || 'applied').toLowerCase().trim();
    const transitionDate = customDate || new Date().toISOString().split('T')[0];
    const statusDateKey = `${cleanStatus}Date`;
    const userKey = getUserKey(currentUser);

    setJobs(prev => {
      const updated = prev.map(j => {
        if (String(j.id) === String(jobId)) {
          const updatedHistory = {
            ...(j.statusHistory || {}),
            [cleanStatus]: transitionDate
          };
          return {
            ...j,
            status: cleanStatus,
            [statusDateKey]: transitionDate,
            lastStatusChangeDate: transitionDate,
            updatedAt: transitionDate,
            statusHistory: updatedHistory
          };
        }
        return j;
      });
      if (currentUser) {
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedJob && String(selectedJob.id) === String(jobId)) {
      setSelectedJob(prev => ({
        ...prev,
        status: cleanStatus,
        [statusDateKey]: transitionDate,
        lastStatusChangeDate: transitionDate
      }));
    }

    await apiService.updateApplication(jobId, {
      status: cleanStatus,
      [statusDateKey]: transitionDate,
      lastStatusChangeDate: transitionDate
    });
  };

  // Update application reminder date (reschedule or mark completed / cleared)
  const handleUpdateReminderDate = async (jobId, newReminderDate) => {
    const userKey = getUserKey(currentUser);
    const cleanDate = newReminderDate ? String(newReminderDate).trim() : null;

    setJobs(prev => {
      const updated = prev.map(j => {
        if (String(j.id) === String(jobId)) {
          return {
            ...j,
            reminderDate: cleanDate,
            followUpDate: cleanDate,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return j;
      });
      if (currentUser) {
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedJob && String(selectedJob.id) === String(jobId)) {
      setSelectedJob(prev => ({
        ...prev,
        reminderDate: cleanDate,
        followUpDate: cleanDate
      }));
    }

    try {
      await apiService.updateApplication(jobId, {
        reminderDate: cleanDate,
        followUpDate: cleanDate
      });
    } catch (err) {
      console.warn('Failed to sync reminder date to backend:', err);
    }

    setToast({
      title: cleanDate ? 'Reminder Rescheduled' : 'Reminder Marked Done',
      message: cleanDate 
        ? `Reminder rescheduled to ${cleanDate}. Removed from Today's List!` 
        : 'Reminder cleared and removed from Today\'s List!',
      type: 'success'
    });
  };

  // Remove application entry (moves it to Removed Entries archive)
  const handleDeleteJob = async (jobId) => {
    const userKey = getUserKey(currentUser);
    const targetJob = jobs.find(j => String(j.id) === String(jobId));

    setJobs(prev => {
      const filtered = prev.filter(j => String(j.id) !== String(jobId));
      if (currentUser) {
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(filtered));
      }
      return filtered;
    });

    if (targetJob) {
      const company = targetJob.companyName || targetJob.company || 'Application';
      setRemovedJobs(prev => {
        const updatedRemoved = [targetJob, ...prev.filter(j => String(j.id) !== String(jobId))];
        if (currentUser) {
          localStorage.setItem(`careerplus_removed_jobs_${userKey}`, JSON.stringify(updatedRemoved));
        }
        return updatedRemoved;
      });

      setToast({
        title: 'Application Removed',
        message: `Entry for ${company} moved to Removed Entries`,
        type: 'delete',
        jobId: targetJob.id
      });
    }

    setSelectedJob(null);
    await apiService.deleteApplication(jobId);
  };

  // Restore application from Removed Entries back to active Kanban board
  const handleRestoreJob = (jobId) => {
    const userKey = getUserKey(currentUser);
    const targetJob = removedJobs.find(j => String(j.id) === String(jobId));

    if (targetJob) {
      setRemovedJobs(prev => {
        const filteredRemoved = prev.filter(j => String(j.id) !== String(jobId));
        if (currentUser) {
          localStorage.setItem(`careerplus_removed_jobs_${userKey}`, JSON.stringify(filteredRemoved));
        }
        return filteredRemoved;
      });

      setJobs(prev => {
        const restored = [targetJob, ...prev.filter(j => String(j.id) !== String(jobId))];
        if (currentUser) {
          localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(restored));
        }
        return restored;
      });
    }
  };

  // Permanently delete application from Removed Entries
  const handlePermanentDeleteJob = (jobId) => {
    const userKey = getUserKey(currentUser);
    setRemovedJobs(prev => {
      const filteredRemoved = prev.filter(j => String(j.id) !== String(jobId));
      if (currentUser) {
        localStorage.setItem(`careerplus_removed_jobs_${userKey}`, JSON.stringify(filteredRemoved));
      }
      return filteredRemoved;
    });
  };

  // Save notes handler synced with Spring Boot 8080, SQLite & localStorage persistence
  const handleAddNote = async (jobId, newNotesText) => {
    const userKey = getUserKey(currentUser);
    setJobs(prev => {
      const updated = prev.map(j => {
        if (String(j.id) === String(jobId)) {
          return { ...j, notes: newNotesText };
        }
        return j;
      });
      if (currentUser) {
        localStorage.setItem(`careerplus_jobs_${userKey}`, JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedJob && String(selectedJob.id) === String(jobId)) {
      setSelectedJob(prev => ({ ...prev, notes: newNotesText }));
    }

    await apiService.updateApplication(jobId, { notes: newNotesText });
  };

  // Download Applications Progress Report as Excel / CSV Spreadsheet
  const handleExportExcel = () => {
    if (!jobs || jobs.length === 0) {
      alert('No application data available to export.');
      return;
    }

    // Exact columns requested: "Company Name", "Current Stage", "Role", "Salary", "Location of Company"
    const headers = ["Company Name", "Current Stage", "Role", "Salary", "Location of Company"];

    const rows = jobs.map(j => {
      const companyName = (j.companyName || j.company || 'N/A').replace(/"/g, '""');
      const currentStage = (j.status ? String(j.status).toUpperCase() : 'APPLIED').replace(/"/g, '""');
      const role = (j.jobTitle || j.title || 'N/A').replace(/"/g, '""');
      const salary = (j.offeredSalary || j.salary || 'N/A').replace(/"/g, '""');
      const location = (j.location || 'Remote').replace(/"/g, '""');

      return `"${companyName}","${currentStage}","${role}","${salary}","${location}"`;
    });

    const csvString = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const key = getUserKey(currentUser);
    link.setAttribute("download", `CareerPlus_Progress_Report_${key}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('careerplus_user');
    localStorage.removeItem('careerplus_jwt_token');
    setCurrentView('landing');
  };

  // 7 Top Stat Summary Cards
  const totalApplications = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'interviewing').length;
  const offersCount = jobs.filter(j => j.status === 'offered').length;
  const rejectedCount = jobs.filter(j => j.status === 'rejected').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysDueCount = jobs.filter(j => {
    const reminderRaw = j.reminderDate || j.followUpDate;
    if (!reminderRaw) return false;
    let str = String(reminderRaw).trim();
    let timestamp = Number(str);
    let formatted = str;
    if (!isNaN(timestamp) && timestamp > 1000000000) {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) formatted = d.toISOString().split('T')[0];
    } else {
      const parsed = new Date(str);
      if (!isNaN(parsed.getTime())) formatted = parsed.toISOString().split('T')[0];
    }
    return formatted && formatted !== 'Recently' && formatted !== 'None Set' && formatted <= todayStr;
  }).length;
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

  // Render Landing Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          currentUser={currentUser}
          onNavigateDashboard={() => setCurrentView('dashboard')}
          onNavigateLogin={() => setCurrentView(currentUser ? 'dashboard' : 'login')}
          onNavigateSignUp={() => setCurrentView(currentUser ? 'dashboard' : 'signup')}
          onLogout={() => setIsLogoutModalOpen(true)}
        />
        <ConfirmLogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          currentUser={currentUser}
        />
      </>
    );
  }

  // Render Sign Up Page
  if (currentView === 'signup') {
    return (
      <SignUpPage
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateDashboard={handleAuthenticated}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // Render Login Page
  if (currentView === 'login') {
    return (
      <LoginPage
        onNavigateSignUp={() => setCurrentView('signup')}
        onNavigateDashboard={handleAuthenticated}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // Render Main Dashboard Workspace
  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-900 flex flex-col font-sans">
      
      {/* Dashboard Top Navigation Bar */}
      <Navbar 
        currentUser={currentUser}
        onOpenAddModal={handleOpenAddModal} 
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onExportExcel={handleExportExcel}
        onLogout={() => setIsLogoutModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace Layout with Left Sidebar Menu Bar */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto relative">
        {/* Left Sidebar Menu Bar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          jobs={jobs}
          removedJobsCount={removedJobs.length}
          onOpenRemovedModal={() => setIsRemovedModalOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          onExportExcel={handleExportExcel}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-y-auto">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, <span className="text-rose-600">{currentUser?.fullName || currentUser?.name || 'Candidate'}</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Job &amp; Internship Application Tracker
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsRemovedModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
              title="View Removed & Archived Applications"
            >
              <Trash2 className="w-4 h-4 text-rose-600 stroke-[2.5]" />
              <span>Removed Entries ({removedJobs.length})</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              title="Download Applications Progress Report (Excel / CSV)"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export Progress Report (Excel)</span>
            </button>
          </div>
        </div>

        {/* Top Summary Cards Bar */}
        <section aria-label="Dashboard Overview Stat Cards">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Card 1: Applied Stage */}
            <div 
              onClick={() => {
                setActiveTab('kanban');
                setStatusFilter(prev => prev === 'applied' ? 'all' : 'applied');
              }}
              role="button"
              tabIndex={0}
              title="Click to view only Applied column"
              className={`bg-white p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group cursor-pointer ${
                statusFilter === 'applied' && activeTab === 'kanban'
                  ? 'border-sky-500 ring-2 ring-sky-500/30 scale-[1.02] shadow-md'
                  : 'border-sky-200/80 hover:border-sky-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">Applied</span>
                <span className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                  📄
                </span>
              </div>
              <p className="text-2xl font-black text-sky-950">{appliedCount}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-sky-600">
                <span>Active Stage</span>
                {statusFilter === 'applied' && activeTab === 'kanban' && (
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md font-extrabold">Active View</span>
                )}
              </div>
            </div>

            {/* Card 2: Interviewing Stage */}
            <div 
              onClick={() => {
                setActiveTab('kanban');
                setStatusFilter(prev => prev === 'interviewing' ? 'all' : 'interviewing');
              }}
              role="button"
              tabIndex={0}
              title="Click to view only Interviewing column"
              className={`bg-white p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group cursor-pointer ${
                statusFilter === 'interviewing' && activeTab === 'kanban'
                  ? 'border-amber-500 ring-2 ring-amber-500/30 scale-[1.02] shadow-md'
                  : 'border-amber-200/80 hover:border-amber-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Interviewing</span>
                <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  ⏰
                </span>
              </div>
              <p className="text-2xl font-black text-amber-900">{interviewingCount}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-600">
                <span>In Progress</span>
                {statusFilter === 'interviewing' && activeTab === 'kanban' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-extrabold">Active View</span>
                )}
              </div>
            </div>

            {/* Card 3: Offers Won */}
            <div 
              onClick={() => {
                setActiveTab('kanban');
                setStatusFilter(prev => prev === 'offered' ? 'all' : 'offered');
              }}
              role="button"
              tabIndex={0}
              title="Click to view only Offers column"
              className={`bg-white p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group cursor-pointer ${
                statusFilter === 'offered' && activeTab === 'kanban'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02] shadow-md'
                  : 'border-emerald-200/80 hover:border-emerald-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Offers</span>
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  🏆
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-900">{offersCount}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600">
                <span>Won Offers</span>
                {statusFilter === 'offered' && activeTab === 'kanban' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-extrabold">Active View</span>
                )}
              </div>
            </div>

            {/* Card 4: Rejected Stage */}
            <div 
              onClick={() => {
                setActiveTab('kanban');
                setStatusFilter(prev => prev === 'rejected' ? 'all' : 'rejected');
              }}
              role="button"
              tabIndex={0}
              title="Click to view only Rejected column"
              className={`bg-white p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group cursor-pointer ${
                statusFilter === 'rejected' && activeTab === 'kanban'
                  ? 'border-rose-500 ring-2 ring-rose-500/30 scale-[1.02] shadow-md'
                  : 'border-rose-200/80 hover:border-rose-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">Rejected</span>
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  📁
                </span>
              </div>
              <p className="text-2xl font-black text-rose-900">{rejectedCount}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-600">
                <span>Archived</span>
                {statusFilter === 'rejected' && activeTab === 'kanban' && (
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md font-extrabold">Active View</span>
                )}
              </div>
            </div>

            {/* Card 5: Total Applications */}
            <div 
              onClick={() => {
                setActiveTab('kanban');
                setStatusFilter('all');
              }}
              role="button"
              tabIndex={0}
              title="Click to view All Columns"
              className={`bg-white p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group cursor-pointer ${
                statusFilter === 'all' && activeTab === 'kanban'
                  ? 'border-rose-500 ring-2 ring-rose-500/30 scale-[1.02] shadow-md'
                  : 'border-rose-200/80 hover:border-rose-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">Total Count</span>
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                  📊
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">{totalApplications}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-700">
                <span>All Columns</span>
                {statusFilter === 'all' && activeTab === 'kanban' && (
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md font-extrabold">Active</span>
                )}
              </div>
            </div>

            {/* Card 6: Action Due Spotlight Card (Today's Reminders & Recruiter Follow-ups) */}
            <div 
              onClick={() => setActiveTab(todaysDueCount > 0 ? 'todays-list' : 'reminders')}
              className="bg-gradient-to-br from-rose-950 via-pink-950 to-slate-900 text-white p-4 rounded-2xl border-2 border-rose-400/80 shadow-2xl shadow-rose-950/40 ring-4 ring-rose-500/20 animate-pulse hover:animate-none hover:scale-[1.03] transition-all duration-300 space-y-1.5 relative overflow-hidden cursor-pointer group"
              title={todaysDueCount > 0 ? "Click to view Today's Reminder List" : "Click to view pending recruiter follow-ups"}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-400"></div>
              
              {/* Top Attention Badge Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-white/15 px-2 py-0.5 rounded-full border border-white/25 flex items-center space-x-1">
                  <span>⚡ {todaysDueCount > 0 ? "TODAY'S ACTIONS" : "ACTION REQUIRED"}</span>
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:rotate-12 transition-transform">
                  🔔
                </span>
              </div>

              <p className="text-2.5xl font-black text-white tracking-tight">
                {todaysDueCount > 0 ? `${todaysDueCount} Reminders` : `${followUpDueCount} Follow-ups`}
              </p>
              <div className="flex items-center justify-between text-[11px] font-extrabold text-rose-200 pt-0.5">
                <span>{todaysDueCount > 0 ? "Today's Reminder List" : "Pending Recruiter Notes"}</span>
                <span className="underline decoration-rose-300 group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </div>

          </div>
        </section>

        {/* Tab 1: Kanban Board View */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onOpenAddModal={handleOpenAddModal}
            />
            <KanbanBoard 
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              jobs={jobs}
              onAddCard={handleOpenAddModal}
              onSelectJob={(job) => setSelectedJob(job)}
              onResetFilter={() => setStatusFilter('all')}
            />
          </div>
        )}

        {/* Tab 2: Today's Action & Reminder List View */}
        {activeTab === 'todays-list' && (
          <TodaysListView 
            jobs={jobs}
            onSelectJob={(job) => setSelectedJob(job)}
            onUpdateReminderDate={handleUpdateReminderDate}
            onOpenAddJob={handleOpenAddModal}
            onNavigateKanban={() => setActiveTab('kanban')}
          />
        )}

        {/* Tab 3: AI Role Matcher View */}
        {activeTab === 'ai-matcher' && (
          <AiRoleMatcherView 
            userResumes={userResumes}
            currentUser={currentUser}
            onOpenAddJob={(prefillData) => {
              setEditingJob(prefillData);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Priority Engine View */}
        {activeTab === 'priority' && (
          <PriorityEngineView jobs={jobs} />
        )}

        {/* Tab 4: Follow-ups & Notes View */}
        {activeTab === 'reminders' && (
          <FollowUpNotesView jobs={jobs} onSelectJob={(job) => setSelectedJob(job)} />
        )}

        {/* Tab 5: Analytics & Insights View */}
        {activeTab === 'analytics' && (
          <AnalyticsView jobs={jobs} />
        )}

      </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">JobTrack • Career Plus</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <button 
            type="button"
            onClick={() => setCurrentView('landing')} 
            className="hover:text-rose-700 font-medium transition-colors cursor-pointer"
          >
            ← Return to Landing Page
          </button>
        </div>
      </footer>

      {/* Modal for "+ Add / Edit Application" */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJob(null);
        }}
        onAddJob={handleSaveJob}
        onSaveJob={handleSaveJob}
        userResumes={userResumes}
        onAddResume={handleAddResume}
        editJobData={editingJob}
      />

      {/* Module 5: Application Details (View / Update / Edit) Drawer Modal */}
      <ApplicationDetailModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onUpdateStatus={handleUpdateStatus}
        onDeleteJob={handleDeleteJob}
        onAddNote={handleAddNote}
        onEditJob={handleOpenEditModal}
        onUpdateReminderDate={handleUpdateReminderDate}
      />

      {/* User Profile & Multiple Resumes Management Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        userResumes={userResumes}
        onAddResume={handleAddResume}
        onDeleteResume={handleDeleteResume}
        onOpenAiMatcher={(res) => {
          setActiveTab('ai-matcher');
          setIsProfileModalOpen(false);
        }}
      />

      {/* Removed / Archived Applications Trash Bin Modal */}
      <RemovedApplicationsModal
        isOpen={isRemovedModalOpen}
        onClose={() => setIsRemovedModalOpen(false)}
        removedJobs={removedJobs}
        onRestoreJob={handleRestoreJob}
        onPermanentDeleteJob={handlePermanentDeleteJob}
      />

      {/* Floating Toast Notification Banner */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={() => {
          if (toast && toast.jobId) {
            handleRestoreJob(toast.jobId);
          }
        }}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        currentUser={currentUser}
      />

    </div>
  );
}

export default function SafeApp(props) {
  return (
    <ErrorBoundary>
      <AppMain {...props} />
    </ErrorBoundary>
  );
}
