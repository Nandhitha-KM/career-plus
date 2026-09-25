import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, Upload, Briefcase, CheckCircle2, AlertTriangle, 
  ArrowRight, RefreshCw, Layers, Award, TrendingUp, Compass, Plus,
  ChevronDown, ChevronUp, Zap, HelpCircle, Check, Info, Sliders, Tag, X,
  Eye, ExternalLink, Download
} from 'lucide-react';
import { 
  calculateResumeRoleMatch, 
  extractTextFromResumeFile,
  extractSkillsFromText,
  getSuggestedSkillsForRole
} from '../services/aiMatcher';

export default function AiRoleMatcherView({ userResumes = [], onOpenAddJob, currentUser }) {
  // Input State
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [showManualTextInput, setShowManualTextInput] = useState(false);
  const [roleTitle, setRoleTitle] = useState('Senior React Developer');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Requirements Mode State: 'auto' (system inferred) vs 'manual' (user defined)
  const [requirementsMode, setRequirementsMode] = useState('auto');
  const [manualSkills, setManualSkills] = useState(['React', 'TypeScript', 'Tailwind', 'REST API', 'Git']);
  const [manualMinYears, setManualMinYears] = useState(2);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Processing & Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  // Resume Document Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    title: '',
    fileName: '',
    fileUrl: '',
    extractedText: '',
    detectedSkills: [],
    isLoadingText: false
  });
  const [activePreviewTab, setActivePreviewTab] = useState('document'); // 'document' | 'text'

  // Popular Quick-Pill Archetypes
  const popularRoles = [
    { title: 'Senior React Developer', desc: 'Expertise in React, TypeScript, State Management & Tailwind' },
    { title: 'Java Spring Boot Engineer', desc: 'Microservices, REST APIs, SQL, JPA & Cloud' },
    { title: 'Full Stack Developer', desc: 'Node.js, React, MongoDB/PostgreSQL & REST APIs' },
    { title: 'DevOps & Cloud Specialist', desc: 'Docker, Kubernetes, AWS, CI/CD & Terraform' },
    { title: 'Python Backend Developer', desc: 'Python, FastAPI, Django, PostgreSQL & Redis' },
    { title: 'AI / Machine Learning Engineer', desc: 'Python, PyTorch, LLMs, LangChain, RAG & Vector DBs' }
  ];

  // Set default resume on mount if available
  useEffect(() => {
    if (userResumes && userResumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(userResumes[0].id);
    }
  }, [userResumes, selectedResumeId]);

  // Handle adding skill to manual requirements
  const handleAddManualSkill = (skillToAdd) => {
    const skill = (skillToAdd || newSkillInput).trim();
    if (!skill) return;
    if (!manualSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setManualSkills(prev => [...prev, skill]);
    }
    setNewSkillInput('');
  };

  // Handle removing skill from manual requirements
  const handleRemoveManualSkill = (skillToRemove) => {
    setManualSkills(prev => prev.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  // Pre-fill manual skills from role archetype
  const handlePreFillFromRole = (customTitle) => {
    const title = customTitle || roleTitle;
    const suggested = getSuggestedSkillsForRole(title);
    if (suggested && suggested.length > 0) {
      setManualSkills(suggested.slice(0, 8).map(s => s.charAt(0).toUpperCase() + s.slice(1)));
    }
  };

  // Handle File Upload (.pdf, .txt, .docx)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setSelectedResumeId('uploaded');
      setAnalysisError('');
    }
  };

  // Open Resume Preview Modal to verify document
  const handleOpenResumePreview = async () => {
    let title = '';
    let fileName = '';
    let fileUrl = '';
    let resumeSource = null;

    if (selectedResumeId === 'uploaded' && uploadedFile) {
      title = uploadedFile.name;
      fileName = uploadedFile.name;
      fileUrl = URL.createObjectURL(uploadedFile);
      resumeSource = uploadedFile;
    } else if (selectedResumeId && selectedResumeId !== 'uploaded') {
      const saved = userResumes.find(r => r.id === selectedResumeId);
      if (saved) {
        title = saved.title;
        fileName = saved.fileName || `${saved.title}.pdf`;
        if (saved.dataUrl && saved.dataUrl.startsWith('data:application/pdf')) {
          try {
            const base64Data = saved.dataUrl.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            fileUrl = URL.createObjectURL(blob);
          } catch (e) {
            fileUrl = saved.dataUrl;
          }
        } else {
          fileUrl = saved.dataUrl || '';
        }
        resumeSource = saved.dataUrl || `${saved.title} candidate resume`;
      }
    } else if (manualText.trim()) {
      title = 'Pasted Resume Text';
      fileName = 'pasted_resume_text.txt';
      resumeSource = manualText.trim();
    }

    if (!resumeSource && !fileUrl) {
      setAnalysisError('Please upload or select a resume first to view it.');
      return;
    }

    setPreviewData({
      title: title || 'Candidate Resume Document',
      fileName: fileName || 'resume.pdf',
      fileUrl,
      extractedText: 'Reading and parsing resume contents...',
      detectedSkills: [],
      isLoadingText: true
    });
    setIsPreviewModalOpen(true);
    setActivePreviewTab(fileUrl ? 'document' : 'text');

    try {
      const text = await extractTextFromResumeFile(resumeSource);
      const skills = extractSkillsFromText(text);
      setPreviewData(prev => ({
        ...prev,
        extractedText: text || 'No text could be extracted from this document.',
        detectedSkills: skills,
        isLoadingText: false
      }));
    } catch (err) {
      console.warn('Resume text preview error:', err);
      setPreviewData(prev => ({
        ...prev,
        extractedText: 'Error parsing text from document.',
        detectedSkills: [],
        isLoadingText: false
      }));
    }
  };

  // Run AI Analysis
  const handleGenerateScore = async (e) => {
    if (e) e.preventDefault();
    setAnalysisError('');

    if (!roleTitle.trim()) {
      setAnalysisError('Please enter a target job role title (e.g. "Senior React Developer").');
      return;
    }

    let resumeText = '';

    try {
      setIsAnalyzing(true);

      // Determine text source: manual text, uploaded file, or saved resume
      if (manualText.trim()) {
        resumeText = manualText.trim();
      } else if (selectedResumeId === 'uploaded' && uploadedFile) {
        resumeText = await extractTextFromResumeFile(uploadedFile);
      } else if (selectedResumeId && selectedResumeId !== 'uploaded') {
        const saved = userResumes.find(r => r.id === selectedResumeId);
        if (saved) {
          resumeText = saved.dataUrl 
            ? await extractTextFromResumeFile(saved.dataUrl) 
            : `${saved.title} candidate resume with software development experience in ${saved.targetRole || 'engineering'}`;
        }
      }

      // Default sample fallback if minimal text
      if (!resumeText || resumeText.length < 20) {
        resumeText = `Senior Software Engineer with 4+ years experience developing scalable web applications. Proficient in React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux, RESTful APIs, Node.js, Git, Unit Testing, and Agile development. Led front-end architecture reducing page load time by 35% and scaling to 500k monthly active users.`;
      }

      // Execute AI scoring algorithm with manual or automatic requirements
      const result = await calculateResumeRoleMatch({
        resumeText,
        roleTitle: roleTitle.trim(),
        jobDescription: jobDescription.trim(),
        candidateName: currentUser?.name || 'Candidate',
        manualRequirements: {
          enabled: requirementsMode === 'manual',
          coreSkills: manualSkills,
          minYears: manualMinYears
        }
      });

      // Brief animation timeout for realistic UX
      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
      }, 700);

    } catch (err) {
      console.error('AI Matching error:', err);
      setAnalysisError('Unable to analyze resume. Please check the file or paste resume text.');
      setIsAnalyzing(false);
    }
  };

  // Pre-fill Add Application modal with matched role and resume
  const handleCreateApplicationFromMatch = () => {
    if (!onOpenAddJob) return;

    let resumeName = '';
    if (selectedResumeId === 'uploaded' && uploadedFile) {
      resumeName = uploadedFile.name;
    } else if (selectedResumeId) {
      const saved = userResumes.find(r => r.id === selectedResumeId);
      if (saved) resumeName = `${saved.title} (${saved.fileName})`;
    }

    const prefillData = {
      jobTitle: roleTitle,
      companyName: companyName || 'Target Company',
      skillsRequired: analysisResult ? analysisResult.matchedSkills.slice(0, 6).join(', ') : 'React, TypeScript',
      resumeName: resumeName || 'Standard Candidate Resume.pdf',
      priorityScore: analysisResult ? analysisResult.compositeScore : 75,
      notes: analysisResult ? `AI Match Score: ${analysisResult.compositeScore}% (${analysisResult.rating}). Top Skills: ${analysisResult.matchedSkills.slice(0, 4).join(', ')}` : ''
    };

    onOpenAddJob(prefillData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-pink-900 to-rose-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-pink-400/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/30 px-3.5 py-1 rounded-full text-xs font-black text-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
              <span>AI Semantic Matching Engine</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              AI Resume-to-Role Match Score
            </h2>
            
            <p className="text-xs md:text-sm text-rose-100/90 font-medium leading-relaxed">
              Upload your resume and enter any target role to generate an instant AI Match Score (0–100%). Uncover matched competencies, identify skill gaps, and get personalized ATS optimization suggestions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center space-x-4 self-start md:self-auto min-w-[220px]">
            <div className="w-12 h-12 rounded-xl bg-rose-500/30 border border-rose-400/40 flex items-center justify-center text-rose-200">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-rose-200 uppercase tracking-wider">Target Fit</p>
              <p className="text-lg font-black text-white">Multi-Factor AI</p>
              <p className="text-[10px] text-rose-200/80">Skills • Seniority • ATS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Controls / Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Configuration & Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Role & Resume Configuration</h3>
              <p className="text-[11px] text-slate-500">Provide target job details and select your resume</p>
            </div>
          </div>

          <form onSubmit={handleGenerateScore} className="space-y-4">
            
            {/* 1. Target Role Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Job Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer, DevOps Specialist..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  required
                />
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Quick Popular Role Buttons */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularRoles.slice(0, 4).map((role, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRoleTitle(role.title);
                      setJobDescription(role.desc);
                      if (requirementsMode === 'manual') {
                        handlePreFillFromRole(role.title);
                      }
                    }}
                    className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      roleTitle === role.title 
                        ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold' 
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Company Name (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Company (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Microsoft, Atlassian..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>

            {/* 2. Resume Selection Option */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Candidate Resume Document <span className="text-rose-500">*</span>
              </label>

              {/* A. Choose from profile resumes if available */}
              {userResumes && userResumes.length > 0 && (
                <div className="space-y-1.5">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => {
                      setSelectedResumeId(e.target.value);
                      if (e.target.value !== 'uploaded') setUploadedFile(null);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  >
                    {userResumes.map((res) => (
                      <option key={res.id} value={res.id}>
                        📄 {res.title} ({res.fileName})
                      </option>
                    ))}
                    <option value="uploaded">➕ Upload New Document File</option>
                  </select>

                  {selectedResumeId && selectedResumeId !== 'uploaded' && (
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] text-slate-500 font-medium">Selected profile resume</span>
                      <button
                        type="button"
                        onClick={handleOpenResumePreview}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-600" />
                        <span>View Document</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* B. File Upload Box (if selected 'uploaded' or no saved resumes) */}
              {(selectedResumeId === 'uploaded' || !userResumes || userResumes.length === 0) && (
                <div className="relative border-2 border-dashed border-rose-300/80 hover:border-rose-500 bg-rose-50/40 rounded-2xl p-4 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-rose-600" />
                    <p className="text-xs font-bold text-slate-700">Click to upload or drag resume</p>
                    <p className="text-[10px] text-slate-400">Supports PDF, TXT, DOC, DOCX</p>
                  </div>
                </div>
              )}

              {uploadedFile && (
                <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900 font-bold shadow-xs">
                  <div className="flex items-center space-x-2.5 truncate min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-slate-900">{uploadedFile.name}</p>
                      <p className="text-[10.5px] text-rose-700 font-medium">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for matching
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenResumePreview}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-rose-100 border border-rose-300 rounded-xl text-xs font-extrabold text-rose-800 transition-all cursor-pointer shadow-xs flex-shrink-0"
                    title="View uploaded resume to verify contents"
                  >
                    <Eye className="w-3.5 h-3.5 text-rose-600" />
                    <span>View Resume</span>
                  </button>
                </div>
              )}

              {/* Toggle to paste text directly */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualTextInput(!showManualTextInput)}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-800 flex items-center space-x-1 cursor-pointer"
                >
                  <span>{showManualTextInput ? '− Hide Paste Text Option' : '+ Or Paste Resume Text Directly'}</span>
                </button>

                {showManualTextInput && (
                  <div className="mt-2 animate-in fade-in">
                    <textarea
                      rows={4}
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Paste your resume summary, skills, or LinkedIn profile text here..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* 3. Role Requirements Mode: Automatic vs. Manual Custom */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Role Requirements Source <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  {requirementsMode === 'auto' ? '🤖 System Inferred' : '✍️ Custom Defined'}
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setRequirementsMode('auto')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    requirementsMode === 'auto'
                      ? 'bg-white text-rose-700 shadow-xs border border-rose-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Automatic (System)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRequirementsMode('manual');
                    if (manualSkills.length === 0) {
                      handlePreFillFromRole();
                    }
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    requirementsMode === 'manual'
                      ? 'bg-white text-rose-700 shadow-xs border border-rose-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-rose-500" />
                  <span>Manual Input</span>
                </button>
              </div>

              {/* Mode A: Automatic Information Banner */}
              {requirementsMode === 'auto' && (
                <div className="p-3 bg-rose-50/40 border border-rose-200/60 rounded-2xl flex items-start space-x-2.5 text-xs text-slate-600 animate-in fade-in duration-150">
                  <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Automatic Requirements Active</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      The AI automatically detects core skills, secondary competencies, and seniority expectations based on <strong className="text-slate-700 font-bold">"{roleTitle}"</strong> and standard benchmarks.
                    </p>
                  </div>
                </div>
              )}

              {/* Mode B: Manual Custom Requirements Builder */}
              {requirementsMode === 'manual' && (
                <div className="p-4 bg-rose-50/30 border border-rose-200/80 rounded-2xl space-y-3.5 animate-in fade-in duration-150">
                  
                  {/* Header & Auto-populate Button */}
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-600" />
                      Required Skills ({manualSkills.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePreFillFromRole()}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Load recommended skills for this role"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Pre-fill from Role</span>
                    </button>
                  </div>

                  {/* Skills Chips Container */}
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white rounded-xl border border-rose-100">
                    {manualSkills.length > 0 ? (
                      manualSkills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-rose-50 text-rose-800 text-[11px] font-bold rounded-lg border border-rose-200 group"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveManualSkill(skill)}
                            className="ml-1.5 text-rose-400 hover:text-rose-700 rounded-full hover:bg-rose-200/50 p-0.5 transition-colors cursor-pointer"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic py-1">No skills added yet. Type below to add required skills.</span>
                    )}
                  </div>

                  {/* Add New Skill Input Row */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManualSkill();
                        }
                      }}
                      placeholder="Type a skill (e.g. Docker, Python, AWS) & press Enter..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddManualSkill()}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 cursor-pointer shadow-xs transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Quick Clickable Suggestions Pills */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Quick Add Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {getSuggestedSkillsForRole(roleTitle)
                        .filter(s => !manualSkills.some(ms => ms.toLowerCase() === s.toLowerCase()))
                        .slice(0, 6)
                        .map((suggested, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddManualSkill(suggested.charAt(0).toUpperCase() + suggested.slice(1))}
                            className="px-2 py-0.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[10px] font-semibold rounded-md border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer flex items-center space-x-0.5"
                          >
                            <span>+ {suggested}</span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Minimum Experience Selector */}
                  <div className="pt-2 border-t border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        Min. Experience Required
                      </label>
                      <p className="text-[10px] text-slate-400">Required career tenure threshold</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
                      {[0, 1, 2, 3, 5, 7].map((yrs) => (
                        <button
                          key={yrs}
                          type="button"
                          onClick={() => setManualMinYears(yrs)}
                          className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            manualMinYears === yrs
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {yrs === 0 ? '0y' : `${yrs}y+`}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Optional Job Description Box */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Description / Key Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job posting snippet or specific requirements to perform deeper keyword matching..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              />
            </div>

            {analysisError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {analysisError}
              </div>
            )}

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer ${
                isAnalyzing 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:shadow-lg hover:shadow-rose-600/25 hover:scale-[1.01]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning &amp; Evaluating Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Match Score</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Dynamic Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Primary Score Hero Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Circular Dial & Rating */}
                  <div className="flex items-center space-x-6">
                    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-md"></div>
                      
                      {/* Circular SVG Ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e11d48"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * analysisResult.compositeScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      
                      {/* Inside Dial Percentage */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900 leading-none">
                          {analysisResult.compositeScore}%
                        </span>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 mt-0.5">Match</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${analysisResult.ratingColor}`}>
                          {analysisResult.rating}
                        </span>
                        {analysisResult.isManualRequirements ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                            ✍️ Custom Manual Mode
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            🤖 Auto System Mode
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                        Fit for {analysisResult.roleTitle}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {analysisResult.isManualRequirements ? (
                          <span className="text-rose-700 font-semibold">
                            Evaluated against {analysisResult.totalCoreCount} manually defined requirements ({analysisResult.expectedYears}+ yrs exp).
                          </span>
                        ) : (
                          <span>
                            Evaluated against {analysisResult.totalCoreCount} standard industry competencies &amp; experience thresholds.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* One-Click Action: Create Application from Match */}
                  <button
                    type="button"
                    onClick={handleCreateApplicationFromMatch}
                    className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-rose-500/20 transition-all cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Apply for this Role</span>
                  </button>

                </div>

                {/* 4 Granular Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
                  
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Skills Match</span>
                    <p className="text-lg font-black text-rose-700">{analysisResult.metrics.skillsMatch}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${analysisResult.metrics.skillsMatch}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Role Alignment</span>
                    <p className="text-lg font-black text-teal-700">{analysisResult.metrics.roleAlignment}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${analysisResult.metrics.roleAlignment}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Experience Fit</span>
                    <p className="text-lg font-black text-sky-700">{analysisResult.metrics.experienceFit}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${analysisResult.metrics.experienceFit}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">ATS Readiness</span>
                    <p className="text-lg font-black text-amber-700">{analysisResult.metrics.atsOptimization}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analysisResult.metrics.atsOptimization}%` }}></div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Skills Matrix: Matched vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Matched Skills Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-800">
                        Matched Skills ({analysisResult.matchedSkills.length})
                      </h5>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      Verified Fit
                    </span>
                  </div>

                  {analysisResult.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedSkills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-rose-50/80 border border-rose-200 text-rose-900 rounded-lg text-xs font-bold flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-rose-600" />
                          <span>{skill.toUpperCase()}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No exact core skills detected for this role archetype.</p>
                  )}
                </div>

                {/* Missing Skills Gap Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-800">
                        Missing Skill Gaps ({analysisResult.missingSkills.length})
                      </h5>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      Recommended
                    </span>
                  </div>

                  {analysisResult.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingSkills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center space-x-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{skill.toUpperCase()}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-rose-700 font-bold">Awesome! Zero critical skill gaps identified.</p>
                  )}
                </div>

              </div>

              {/* Actionable AI Recommendations */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">AI Optimization Suggestions</h5>
                    <p className="text-[11px] text-slate-500">Concrete steps to elevate your ATS score for this opening</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>{rec.title}</span>
                        </p>
                        <p className="text-slate-600 leading-relaxed pl-3.5">{rec.description}</p>
                      </div>

                      <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-black rounded-lg flex-shrink-0">
                        {rec.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Empty Placeholder State */
            <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-base font-extrabold text-slate-900">Ready to Analyze Resume Match</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your target role on the left and click <strong>"Generate AI Match Score"</strong> to view your skills alignment, missing gaps, and ATS recommendations.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleGenerateScore}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Run Sample Analysis
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Resume Verification & Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-rose-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 text-white flex items-center justify-between border-b border-rose-800/50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-rose-200 border border-white/20 flex-shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white truncate flex items-center space-x-2">
                    <span>Resume Document Verification</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-bold border border-rose-400/30">
                      Uploaded File
                    </span>
                  </h4>
                  <p className="text-[11px] text-rose-200/90 truncate font-medium">{previewData.fileName || previewData.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {previewData.fileUrl && (
                  <a
                    href={previewData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5 text-xs font-bold border border-white/20"
                    title="Open document in a new browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Fullscreen</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs Switcher */}
            <div className="px-6 py-2.5 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('document')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePreviewTab === 'document'
                      ? 'bg-white text-rose-900 shadow-sm border border-rose-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📄 Visual Document Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('text')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activePreviewTab === 'text'
                      ? 'bg-white text-rose-900 shadow-sm border border-rose-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🔍 Extracted Text & Skills</span>
                  {previewData.detectedSkills.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full border border-rose-200">
                      {previewData.detectedSkills.length}
                    </span>
                  )}
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
                Inspect document to confirm accurate upload
              </span>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activePreviewTab === 'document' ? (
                <div>
                  {previewData.fileUrl ? (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-inner">
                      <iframe
                        src={previewData.fileUrl}
                        title="Resume Document Preview"
                        className="w-full h-[60vh] border-0"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">Visual PDF rendering preview is not available for this format.</p>
                      <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                        Please switch to the <strong>"Extracted Text & Skills"</strong> tab above to view the exact parsed content and recognized technical competencies.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('text')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Inspect Parsed Text & Skills →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recognized Skills Badges */}
                  <div className="p-4 bg-rose-50/90 rounded-2xl border border-rose-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-rose-950 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        <span>Automatically Recognized Resume Skills ({previewData.detectedSkills.length}):</span>
                      </span>
                      <span className="text-[10px] text-rose-700 font-bold bg-white px-2 py-0.5 rounded-md border border-rose-200">
                        {previewData.detectedSkills.length > 0 ? '✓ Ready for AI Scoring' : 'Scanning'}
                      </span>
                    </div>

                    {previewData.detectedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {previewData.detectedSkills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-1 bg-white border border-rose-200 text-rose-800 rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3 text-rose-600" />
                            <span>{skill.toUpperCase()}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        {previewData.isLoadingText ? 'Scanning text for technical competencies...' : 'No common technical keywords recognized yet.'}
                      </p>
                    )}
                  </div>

                  {/* Extracted Text Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Raw Extracted Text from Document:</label>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Character count: {previewData.extractedText.length}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs max-h-[45vh] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner selection:bg-rose-700">
                      {previewData.isLoadingText ? (
                        <div className="flex items-center space-x-2 text-rose-300">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Parsing document streams and decoding text...</span>
                        </div>
                      ) : (
                        previewData.extractedText
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Document verified and ready for matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Confirm & Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
