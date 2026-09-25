import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Building2, Briefcase, FileText, Upload, User, Mail, Phone, DollarSign, Calendar, Globe, MapPin, Bell } from 'lucide-react';
import { calculateResumeRoleMatch } from '../services/aiMatcher';

export default function AddApplicationModal({ isOpen, onClose, onAddJob, onSaveJob, userResumes = [], editJobData = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [aiMatchInfo, setAiMatchInfo] = useState(null);
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    jobTitle: '',
    applicationType: 'Full-time',
    location: '',
    workMode: 'Remote',
    appliedDate: new Date().toISOString().split('T')[0],
    interviewingDate: '',
    offeredDate: '',
    rejectedDate: '',
    reminderDate: '',
    status: 'applied',
    applicationSource: 'LinkedIn',
    recruiterName: '',
    recruiterEmail: '',
    recruiterPhone: '',
    offeredSalary: '',
    skillsRequired: '',
    notes: '',
    resumeName: ''
  });

  const [errors, setErrors] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Pre-populate form fields when editJobData changes or modal opens in Edit Mode
  useEffect(() => {
    if (editJobData && isOpen) {
      const existingNotes = editJobData.notes || editJobData.notesAndDescription || editJobData.description || editJobData.jobDescription || editJobData.notesText || '';
      setFormData({
        companyName: editJobData.companyName || editJobData.company || '',
        companyWebsite: editJobData.companyWebsite || '',
        jobTitle: editJobData.jobTitle || editJobData.title || '',
        applicationType: editJobData.applicationType || 'Full-time',
        location: editJobData.location || '',
        workMode: editJobData.workMode || 'Remote',
        appliedDate: editJobData.appliedDate || editJobData.statusHistory?.applied || new Date().toISOString().split('T')[0],
        interviewingDate: editJobData.interviewingDate || editJobData.statusHistory?.interviewing || '',
        offeredDate: editJobData.offeredDate || editJobData.statusHistory?.offered || '',
        rejectedDate: editJobData.rejectedDate || editJobData.statusHistory?.rejected || '',
        reminderDate: editJobData.reminderDate || editJobData.followUpDate || '',
        status: editJobData.status || 'applied',
        applicationSource: editJobData.applicationSource || 'LinkedIn',
        recruiterName: editJobData.recruiterName || '',
        recruiterEmail: editJobData.recruiterEmail || '',
        recruiterPhone: editJobData.recruiterPhone || '',
        offeredSalary: editJobData.offeredSalary || '',
        skillsRequired: editJobData.skillsRequired || (Array.isArray(editJobData.tags) ? editJobData.tags.join(', ') : ''),
        notes: existingNotes,
        resumeName: editJobData.resumeName || ''
      });
      setCurrentStep(1);
    }
  }, [editJobData, isOpen]);

  // Auto-select first stored profile resume if resumeName is empty
  useEffect(() => {
    if (userResumes && userResumes.length > 0 && (!formData.resumeName || formData.resumeName === '') && !editJobData) {
      const firstRes = userResumes[0];
      const formatted = `${firstRes.title} (${firstRes.fileName})`;
      setFormData(prev => ({ ...prev, resumeName: formatted }));
    }
  }, [userResumes, isOpen, editJobData]);

  if (!isOpen) return null;

  const isEditMode = !!editJobData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const todayStr = new Date().toISOString().split('T')[0];

    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'status') {
        if (value === 'interviewing' && !prev.interviewingDate) updated.interviewingDate = todayStr;
        if (value === 'offered' && !prev.offeredDate) updated.offeredDate = todayStr;
        if (value === 'rejected' && !prev.rejectedDate) updated.rejectedDate = todayStr;
      }
      return updated;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Manual Resume File Upload (.pdf, .doc, .docx)
  const handleManualFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileNameStr = file.name;
      const fileSizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const resumeTitle = fileNameStr.replace(/\.[^/.]+$/, "").replaceAll('_', ' ');

      setUploadedFileName(fileNameStr);

      const formattedLabel = `${resumeTitle} (${fileNameStr})`;
      setFormData(prev => ({ ...prev, resumeName: formattedLabel }));
      if (errors.resumeName) {
        setErrors(prev => ({ ...prev, resumeName: '' }));
      }
    }
  };

  // Quick AI Role Match Checker
  const handleQuickAiCheck = async () => {
    if (!formData.jobTitle || !formData.jobTitle.trim()) return;
    setIsEvaluatingAi(true);
    try {
      const resumeName = formData.resumeName || (userResumes[0] ? userResumes[0].title : '');
      const sampleText = `${resumeName} developer resume with software engineering skills in ${formData.skillsRequired || 'full stack development, web development'}`;
      const res = await calculateResumeRoleMatch({
        resumeText: sampleText,
        roleTitle: formData.jobTitle.trim(),
        jobDescription: formData.notes || ''
      });
      setAiMatchInfo(res);
    } catch(err) {
      console.warn('Quick AI Match error:', err);
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Optional Recruiter Details - Always Passes)
  const validateStep2 = () => true;

  // Step 3 Validation (Resume - auto-fills default resume if unselected so candidate seamlessly reaches Step 4)
  const validateStep3 = () => {
    if (!formData.resumeName || !formData.resumeName.trim()) {
      const defaultRes = (userResumes && userResumes.length > 0)
        ? `${userResumes[0].title} (${userResumes[0].fileName})`
        : 'Primary Candidate Resume (2026.pdf)';
      setFormData(prev => ({ ...prev, resumeName: defaultRes }));
    }
    setErrors(prev => ({ ...prev, resumeName: '' }));
    return true;
  };

  // Handle Next Step (Guarantees wizard moves all the way to Step 4 Notes & Finish without getting stuck)
  const handleNextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep === 3) {
      validateStep3();
      setCurrentStep(4);
    } else if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle Previous Step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Prevent accidental auto-save on Enter key before Step 4
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (currentStep < 4) {
        handleNextStep();
      }
    }
  };

  // Handle Final Submission (STRICT RULE: ONLY EXECUTED ON STEP 4 WHEN CLICKING FINISH & SAVE APPLICATION)
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ABSOLUTE PROTECTION: Never save before Step 4! If on Step 1, 2, or 3, advance step only!
    if (currentStep !== 4) {
      handleNextStep();
      return;
    }

    const newErrors = {};
    if (!formData.companyName || !formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.jobTitle || !formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setCurrentStep(1);
      return;
    }

    const tagsArray = typeof formData.skillsRequired === 'string' && formData.skillsRequired.trim()
      ? formData.skillsRequired.split(',').map(t => t.trim()).filter(Boolean)
      : ['Full-time'];

    const todayStr = new Date().toISOString().split('T')[0];
    const selectedStatus = formData.status || 'applied';

    let appliedVal = null;
    let interviewingVal = null;
    let offeredVal = null;
    let rejectedVal = null;

    if (isEditMode) {
      // PRESERVE existing dates during edit mode; ONLY update the date edited by the user
      appliedVal = formData.appliedDate || editJobData.appliedDate || editJobData.statusHistory?.applied || null;
      interviewingVal = formData.interviewingDate || editJobData.interviewingDate || editJobData.statusHistory?.interviewing || null;
      offeredVal = formData.offeredDate || editJobData.offeredDate || editJobData.statusHistory?.offered || null;
      rejectedVal = formData.rejectedDate || editJobData.rejectedDate || editJobData.statusHistory?.rejected || null;

      if (selectedStatus === 'applied' && !appliedVal) appliedVal = todayStr;
      if (selectedStatus === 'interviewing' && !interviewingVal) interviewingVal = todayStr;
      if (selectedStatus === 'offered' && !offeredVal) offeredVal = todayStr;
      if (selectedStatus === 'rejected' && !rejectedVal) rejectedVal = todayStr;
    } else {
      // New Application Mode: Ensure selected status date is set cleanly
      appliedVal = formData.appliedDate || todayStr;
      interviewingVal = selectedStatus === 'interviewing' ? (formData.interviewingDate || todayStr) : null;
      offeredVal = selectedStatus === 'offered' ? (formData.offeredDate || todayStr) : null;
      rejectedVal = selectedStatus === 'rejected' ? (formData.rejectedDate || todayStr) : null;
    }

    const jobPayload = {
      id: isEditMode ? editJobData.id : 'job-' + Date.now(),
      title: formData.jobTitle.trim(),
      company: formData.companyName.trim(),
      companyName: formData.companyName.trim(),
      companyWebsite: formData.companyWebsite.trim(),
      jobTitle: formData.jobTitle.trim(),
      applicationType: formData.applicationType,
      location: formData.location.trim() || 'Remote',
      workMode: formData.workMode,
      appliedDate: appliedVal,
      interviewingDate: interviewingVal,
      offeredDate: offeredVal,
      rejectedDate: rejectedVal,
      reminderDate: formData.reminderDate || null,
      followUpDate: formData.reminderDate || null,
      lastStatusChangeDate: todayStr,
      statusHistory: {
        applied: appliedVal,
        interviewing: interviewingVal,
        offered: offeredVal,
        rejected: rejectedVal
      },
      status: selectedStatus,
      applicationSource: formData.applicationSource,
      recruiterName: formData.recruiterName.trim() || 'Hiring Manager',
      recruiterEmail: formData.recruiterEmail.trim(),
      recruiterPhone: formData.recruiterPhone.trim(),
      offeredSalary: formData.offeredSalary.trim(),
      skillsRequired: formData.skillsRequired.trim(),
      notes: formData.notes.trim(),
      resumeName: formData.resumeName,
      tags: tagsArray,
      logo: formData.companyName.trim().charAt(0).toUpperCase(),
      priorityScore: isEditMode ? (editJobData.priorityScore || 50) : 50,
      priorityLevel: isEditMode ? (editJobData.priorityLevel || 'MEDIUM') : 'MEDIUM'
    };

    const saveHandler = onAddJob || onSaveJob;
    if (saveHandler) {
      saveHandler(jobPayload);
    }

    // Reset Form and Close
    setFormData({
      companyName: '',
      companyWebsite: '',
      jobTitle: '',
      applicationType: 'Full-time',
      location: '',
      workMode: 'Remote',
      appliedDate: todayStr,
      interviewingDate: '',
      offeredDate: '',
      rejectedDate: '',
      reminderDate: '',
      status: 'applied',
      applicationSource: 'LinkedIn',
      recruiterName: '',
      recruiterEmail: '',
      recruiterPhone: '',
      offeredSalary: '',
      skillsRequired: '',
      notes: '',
      resumeName: ''
    });
    setCurrentStep(1);
    setUploadedFileName('');
    onClose();
  };

  const handleStepClick = (targetStep) => {
    if (targetStep >= 1 && targetStep <= 4) {
      if (targetStep === 4) validateStep3();
      setCurrentStep(targetStep);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {[
        { step: 1, label: 'Job' },
        { step: 2, label: 'Recruiter' },
        { step: 3, label: 'Resume' },
        { step: 4, label: 'Notes & Finish' }
      ].map((s, idx, arr) => {
        const isCurrent = currentStep === s.step;
        const isCompleted = currentStep > s.step;

        return (
          <React.Fragment key={s.step}>
            <div 
              onClick={() => handleStepClick(s.step)}
              className="flex items-center space-x-2 cursor-pointer group"
              title={`Click to jump to Step ${s.step}: ${s.label}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                isCompleted 
                  ? 'bg-rose-600 text-white' 
                  : isCurrent 
                  ? 'bg-rose-600 text-white ring-4 ring-rose-100' 
                  : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : s.step}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${
                isCurrent ? 'text-rose-700 font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < arr.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                currentStep > s.step ? 'bg-rose-600' : 'bg-slate-200'
              }`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Job Application' : 'Add New Job Application'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Step {currentStep} of 4 • Sequential Application Wizard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6">
          
          {/* Wizard Step Indicator */}
          {renderStepIndicator()}

          {/* STEP 1: JOB DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Step 1: Company &amp; Job Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Google, Microsoft, Amazon"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.companyName ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-rose-500/20 focus:border-rose-500'
                      }`}
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.companyName && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.companyName}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Job Title <span className="text-rose-500">*</span>
                    </label>
                    {formData.jobTitle && (
                      <button
                        type="button"
                        onClick={handleQuickAiCheck}
                        disabled={isEvaluatingAi}
                        className="text-[10px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Calculate instant AI Match Score for this title"
                      >
                        <Sparkles className="w-3 h-3 text-rose-600" />
                        <span>{isEvaluatingAi ? 'Analyzing...' : 'AI Match Score'}</span>
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Developer"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.jobTitle ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-rose-500/20 focus:border-rose-500'
                      }`}
                    />
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.jobTitle && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.jobTitle}</p>}

                  {/* Inline AI Match Score Pill */}
                  {aiMatchInfo && (
                    <div className="mt-2 p-2 bg-rose-50/90 border border-rose-200/80 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs">
                          {aiMatchInfo.compositeScore}%
                        </span>
                        <div>
                          <p className="font-extrabold text-rose-950 text-[11px] leading-tight">
                            AI Fit: {aiMatchInfo.rating}
                          </p>
                          <p className="text-[10px] text-rose-700">
                            Key Skills: {aiMatchInfo.matchedSkills.slice(0, 3).join(', ') || 'Analyzed'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (aiMatchInfo.matchedSkills.length > 0) {
                            setFormData(prev => ({
                              ...prev,
                              skillsRequired: aiMatchInfo.matchedSkills.slice(0, 5).join(', ')
                            }));
                          }
                        }}
                        className="text-[10px] font-black text-rose-800 hover:text-rose-950 bg-white border border-rose-300 px-2 py-1 rounded-md shadow-2xs cursor-pointer"
                      >
                        Auto-fill Skills
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Website */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://careers.company.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Location & Work Mode */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location &amp; Work Mode</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bengaluru / Remote"
                        className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">&nbsp;</label>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Application Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-rose-500/50 rounded-xl text-xs font-bold text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Specific Date for Selected Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job {formData.status === 'offered' ? 'Offered' : formData.status === 'interviewing' ? 'Interviewing' : formData.status === 'rejected' ? 'Rejected' : 'Applied'} Date <span className="text-rose-500">*</span>
                  </label>
                  {formData.status === 'applied' && (
                    <input
                      type="date"
                      name="appliedDate"
                      value={formData.appliedDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                    />
                  )}
                  {formData.status === 'interviewing' && (
                    <input
                      type="date"
                      name="interviewingDate"
                      value={formData.interviewingDate || todayStr}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  )}
                  {formData.status === 'offered' && (
                    <input
                      type="date"
                      name="offeredDate"
                      value={formData.offeredDate || todayStr}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-emerald-50/60 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  )}
                  {formData.status === 'rejected' && (
                    <input
                      type="date"
                      name="rejectedDate"
                      value={formData.rejectedDate || todayStr}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-rose-50/60 border border-rose-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  )}
                </div>
              </div>

              {/* Source Channel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source / Channel</label>
                <select
                  name="applicationSource"
                  value={formData.applicationSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Careers">Company Careers Website</option>
                  <option value="Referral">Employee Referral</option>
                  <option value="Naukri">Naukri.com</option>
                  <option value="Glassdoor">Glassdoor</option>
                  <option value="Other">Other Channel</option>
                </select>
              </div>

              {/* Reminder Date (Review on this date) */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-rose-950 flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reminder Date (Review on this date)</span>
                  </label>
                  <span className="text-[10px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                    🔔 Review Alert
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                  <div className="relative">
                    <input
                      type="date"
                      name="reminderDate"
                      value={formData.reminderDate || ''}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <Calendar className="w-4 h-4 text-rose-500 absolute left-3 top-2.5" />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        setFormData(prev => ({ ...prev, reminderDate: d.toISOString().split('T')[0] }));
                      }}
                      className="text-[10.5px] font-bold px-2 py-1 bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer"
                    >
                      +1 Day
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 3);
                        setFormData(prev => ({ ...prev, reminderDate: d.toISOString().split('T')[0] }));
                      }}
                      className="text-[10.5px] font-bold px-2 py-1 bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer"
                    >
                      +3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 7);
                        setFormData(prev => ({ ...prev, reminderDate: d.toISOString().split('T')[0] }));
                      }}
                      className="text-[10.5px] font-bold px-2 py-1 bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer"
                    >
                      +1 Week
                    </button>
                    {formData.reminderDate && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, reminderDate: '' }))}
                        className="text-[10.5px] font-bold px-2 py-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10.5px] text-rose-800/80 font-medium">
                  On this reminder date, this application will automatically surface in your Reminders &amp; Today's Actions list.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: RECRUITER CONTACT */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Step 2: Recruiter Contact &amp; Compensation (Optional)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recruiter Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="recruiterName"
                      value={formData.recruiterName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Recruiter Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      placeholder="sarah.jenkins@company.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recruiter Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Phone</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="recruiterPhone"
                      value={formData.recruiterPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Offered Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Offered Salary / CTC</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="offeredSalary"
                      value={formData.offeredSalary}
                      onChange={handleChange}
                      placeholder="e.g. ₹ 18,00,000 / annum"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESUME SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Step 3: Attach Resume &amp; Document
                </h4>
              </div>

              {/* Option A: Select Saved Resume */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Resume from Profile <span className="text-rose-500">*</span>
                </label>
                {userResumes && userResumes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {userResumes.map((res) => {
                      const labelText = `${res.title} (${res.fileName})`;
                      const isSelected = formData.resumeName === labelText;

                      return (
                        <div
                          key={res.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, resumeName: labelText }));
                            if (errors.resumeName) setErrors(prev => ({ ...prev, resumeName: '' }));
                          }}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-950 font-bold' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80 font-medium'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold">{res.title}</p>
                              <p className="text-[11px] text-slate-500">{res.fileName} • {res.targetRole || 'General'}</p>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-xl">No saved resumes found in profile.</p>
                )}
                {errors.resumeName && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.resumeName}</p>}
              </div>

              {/* Option B: Manual Upload File */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Or Upload New Resume File</label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50/60 rounded-2xl p-4 text-center transition-all">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleManualFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-6 h-6 text-rose-600" />
                    <p className="text-xs font-bold text-slate-700">Click to upload or drag &amp; drop</p>
                    <p className="text-[10px] text-slate-400">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </div>
                {uploadedFileName && (
                  <p className="text-xs font-bold text-rose-600 mt-1.5 flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> Uploaded: {uploadedFileName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: NOTES & FINISH */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Step 4: Skills Required &amp; Notes / Finish
                </h4>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skills Required / Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Spring Boot, PostgreSQL, Tailwind"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              {/* Notes & Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes &amp; Description
                </label>
                <textarea
                  rows={4}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add notes about job role, referral contacts, interview prep tips..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none transition-all"
                />
              </div>

              {/* Reminder Date Check & Adjust in Step 4 */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Scheduled Reminder Date</span>
                    <span className="text-[11px] text-rose-700 font-semibold">
                      {formData.reminderDate ? `Alerts on ${formData.reminderDate}` : 'No reminder scheduled (Optional)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="reminderDate"
                    value={formData.reminderDate || ''}
                    onChange={handleChange}
                    className="px-2.5 py-1.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  {formData.reminderDate && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, reminderDate: '' }))}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-bold px-1.5 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentStep === 3) {
                    validateStep3();
                    setCurrentStep(4);
                  } else {
                    handleNextStep(e);
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                <span>{currentStep === 3 ? 'Next: Notes & Finish' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEditMode ? 'Save Changes' : 'Finish & Save Application'}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
