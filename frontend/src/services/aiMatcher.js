/**
 * CareerPlus - AI Resume-to-Role Semantic Match Engine
 * Provides intelligent skill extraction, role alignment analysis,
 * multi-factor weighted scoring, and actionable resume optimization tips.
 */

// Comprehensive Skills Taxonomy spanning Frontend, Backend, Cloud/DevOps, Database, AI/ML, Mobile & Systems
export const SKILLS_TAXONOMY = {
  frontend: [
    'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'typescript', 'javascript',
    'html', 'html5', 'css', 'css3', 'tailwind', 'tailwind css', 'bootstrap', 'sass', 'scss', 'redux', 'redux toolkit',
    'zustand', 'webpack', 'vite', 'jest', 'cypress', 'storybook', 'graphql', 'rest api', 'rest apis', 'responsive design',
    'ui/ux', 'web accessibility', 'wcag', 'micro-frontends', 'pwa', 'spa', 'svelte', 'react router'
  ],
  backend: [
    'java', 'spring', 'spring boot', 'node', 'node.js', 'nodejs', 'express', 'express.js', 'python', 'django',
    'fastapi', 'flask', 'go', 'golang', 'c#', '.net', 'asp.net', 'ruby', 'ruby on rails', 'php', 'laravel',
    'microservices', 'restful apis', 'rest api', 'grpc', 'kafka', 'rabbitmq', 'hibernate', 'jpa', 'servlet',
    'jwt', 'oauth', 'oauth2', 'web sockets', 'websocket', 'multithreading', 'concurrency', 'graphql api'
  ],
  database: [
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'dynamodb',
    'elasticsearch', 'mariadb', 'neo4j', 'database indexing', 'query optimization', 'prisma', 'typeorm', 'mongoose',
    'nosql', 'rdbms', 'data modeling', 'acid compliance'
  ],
  cloudDevOps: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'ci/cd',
    'github actions', 'jenkins', 'terraform', 'ansible', 'linux', 'bash', 'shell scripting', 'nginx', 'apache',
    'cloudformation', 'helm', 'prometheus', 'grafana', 'serverless', 'lambda', 's3', 'ec2', 'ecs', 'eks', 'iam'
  ],
  dataAi: [
    'python', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'scikit-learn', 'data analysis', 'machine learning',
    'deep learning', 'nlp', 'natural language processing', 'computer vision', 'large language models', 'llm',
    'llms', 'langchain', 'openai', 'gemini', 'rag', 'vector database', 'faiss', 'chromadb', 'bigquery', 'spark',
    'data pipelines', 'etl', 'tableau', 'power bi'
  ],
  mobile: [
    'react native', 'flutter', 'swift', 'swiftui', 'kotlin', 'android', 'ios', 'objective-c', 'mobile app development',
    'expo', 'jetpack compose', 'dart'
  ],
  engineeringPractices: [
    'git', 'github', 'gitlab', 'agile', 'scrum', 'jira', 'ci/cd', 'tdd', 'unit testing', 'integration testing',
    'code review', 'system design', 'data structures', 'algorithms', 'clean code', 'design patterns', 'oop',
    'solid principles', 'continuous integration', 'debugging', 'performance optimization'
  ],
  softSkills: [
    'leadership', 'mentorship', 'team collaboration', 'communication', 'problem solving', 'critical thinking',
    'cross-functional collaboration', 'stakeholder management', 'project management', 'agile methodology',
    'time management', 'adaptability', 'analytical skills'
  ]
};

// Flattened list of all canonical skills for fast lookup
export const ALL_CANONICAL_SKILLS = Object.values(SKILLS_TAXONOMY).flat();

/**
 * Common Role Archetype Presets to infer standard requirements when only a title is entered
 */
export const ROLE_ARCHETYPES = {
  'frontend': {
    title: 'Frontend Developer',
    coreSkills: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'rest api', 'git', 'responsive design', 'redux'],
    secondarySkills: ['next.js', 'jest', 'cypress', 'ui/ux', 'webpack', 'vite', 'graphql'],
    minYears: 2
  },
  'react': {
    title: 'React Developer',
    coreSkills: ['react', 'javascript', 'typescript', 'redux', 'tailwind', 'html', 'css', 'rest api', 'git', 'vite'],
    secondarySkills: ['next.js', 'jest', 'react router', 'graphql', 'zustand'],
    minYears: 2
  },
  'backend': {
    title: 'Backend Developer',
    coreSkills: ['java', 'spring boot', 'node.js', 'sql', 'rest api', 'microservices', 'database indexing', 'git', 'docker'],
    secondarySkills: ['redis', 'kafka', 'postgresql', 'aws', 'kubernetes', 'graphql', 'jwt'],
    minYears: 3
  },
  'java': {
    title: 'Java Backend Developer',
    coreSkills: ['java', 'spring boot', 'spring', 'sql', 'microservices', 'rest api', 'hibernate', 'git', 'mysql'],
    secondarySkills: ['kafka', 'docker', 'postgresql', 'redis', 'aws', 'junit'],
    minYears: 2
  },
  'fullstack': {
    title: 'Full Stack Developer',
    coreSkills: ['react', 'javascript', 'node.js', 'typescript', 'sql', 'rest api', 'git', 'html', 'css', 'mongodb'],
    secondarySkills: ['docker', 'aws', 'tailwind', 'postgresql', 'redis', 'next.js', 'ci/cd'],
    minYears: 3
  },
  'full stack': {
    title: 'Full Stack Developer',
    coreSkills: ['react', 'javascript', 'node.js', 'typescript', 'sql', 'rest api', 'git', 'html', 'css', 'mongodb'],
    secondarySkills: ['docker', 'aws', 'tailwind', 'postgresql', 'redis', 'next.js', 'ci/cd'],
    minYears: 3
  },
  'devops': {
    title: 'DevOps / Cloud Engineer',
    coreSkills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'git', 'bash', 'jenkins', 'python'],
    secondarySkills: ['ansible', 'prometheus', 'grafana', 'azure', 'gcp', 'helm', 'nginx'],
    minYears: 3
  },
  'cloud': {
    title: 'Cloud Engineer',
    coreSkills: ['aws', 'cloudformation', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'linux', 'python', 'git'],
    secondarySkills: ['azure', 'gcp', 'serverless', 'iam', 's3', 'ec2'],
    minYears: 3
  },
  'python': {
    title: 'Python Developer / Engineer',
    coreSkills: ['python', 'django', 'fastapi', 'sql', 'rest api', 'git', 'docker', 'postgresql'],
    secondarySkills: ['redis', 'celery', 'aws', 'pandas', 'linux', 'pytest'],
    minYears: 2
  },
  'data': {
    title: 'Data Analyst / Engineer',
    coreSkills: ['sql', 'python', 'pandas', 'numpy', 'data analysis', 'tableau', 'power bi', 'git'],
    secondarySkills: ['bigquery', 'spark', 'etl', 'machine learning', 'postgresql'],
    minYears: 2
  },
  'ai': {
    title: 'AI / ML Engineer',
    coreSkills: ['python', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'pandas', 'nlp', 'llms', 'git'],
    secondarySkills: ['langchain', 'rag', 'docker', 'vector database', 'scikit-learn', 'openai'],
    minYears: 2
  },
  'mobile': {
    title: 'Mobile App Developer',
    coreSkills: ['react native', 'flutter', 'javascript', 'typescript', 'mobile app development', 'git', 'rest api'],
    secondarySkills: ['swift', 'kotlin', 'ios', 'android', 'redux', 'firebase'],
    minYears: 2
  },
  'software': {
    title: 'Software Engineer',
    coreSkills: ['data structures', 'algorithms', 'git', 'system design', 'oop', 'rest api', 'sql', 'clean code'],
    secondarySkills: ['docker', 'ci/cd', 'unit testing', 'agile', 'linux'],
    minYears: 2
  }
};

/**
 * Clean text for tokenization and normalization
 */
export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s.#+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Dynamically loads and prepares Mozilla's pdf.js if not already present
 */
export async function loadPdfJs() {
  if (typeof window === 'undefined') return null;

  if (window.pdfjsLib) {
    if (!window.pdfjsLib.GlobalWorkerOptions?.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    return window.pdfjsLib;
  }

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="pdf.min.js"]');
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          resolve(null);
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        resolve(null);
      }
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

/**
 * Extracts text from an ArrayBuffer of a PDF using PDF.js and native stream decompressor
 */
export async function parsePdfArrayBuffer(arrayBuffer) {
  // Method 1: Mozilla PDF.js (Gold standard - extracts text from Overleaf, LaTeX, Word, Canva)
  try {
    const pdfjs = await loadPdfJs();
    if (pdfjs) {
      // Clone buffer to avoid detached buffer issues
      const bufferCopy = arrayBuffer.slice(0);
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bufferCopy) });
      const pdf = await loadingTask.promise;
      const textPieces = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items
          .map(item => item.str)
          .filter(Boolean)
          .join(' ');
        textPieces.push(pageText);
      }

      const fullText = textPieces.join('\n');
      if (fullText && fullText.trim().length > 20) {
        return fullText;
      }
    }
  } catch (pdfErr) {
    console.warn('PDF.js text parsing error, attempting stream fallback:', pdfErr);
  }

  // Method 2: Browser native DecompressionStream on PDF streams
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const binaryString = new TextDecoder('latin1').decode(bytes);
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    const extractedWords = [];
    let match;

    while ((match = streamRegex.exec(binaryString)) !== null) {
      const streamStart = match.index + match[0].indexOf('\n') + 1;
      const streamEnd = match.index + match[0].lastIndexOf('endstream');
      const streamBytes = bytes.subarray(streamStart, streamEnd);

      if (window.DecompressionStream && streamBytes.length > 6) {
        try {
          const ds = new DecompressionStream('deflate');
          const writer = ds.writable.getWriter();
          writer.write(streamBytes);
          writer.close();
          const response = new Response(ds.readable);
          const decompressed = await response.text();

          // Search for text operators: (text) Tj
          const tjRegex = /\(([^)]+)\)\s*Tj/g;
          let m;
          while ((m = tjRegex.exec(decompressed)) !== null) {
            extractedWords.push(m[1].replace(/\\([()\\])/g, '$1'));
          }

          // Search for TJ arrays: [(text)] TJ
          const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
          let am;
          while ((am = tjArrayRegex.exec(decompressed)) !== null) {
            const inner = am[1];
            const sub = /\(([^)]+)\)/g;
            let sm;
            while ((sm = sub.exec(inner)) !== null) {
              extractedWords.push(sm[1].replace(/\\([()\\])/g, '$1'));
            }
          }

          // Match words
          const generalWords = decompressed.match(/[A-Za-z0-9#+.]{2,}/g);
          if (generalWords) {
            extractedWords.push(...generalWords);
          }
        } catch (e) {
          // Stream might not be deflate
        }
      }
    }

    if (extractedWords.length > 20) {
      return extractedWords.join(' ');
    }
  } catch (fallbackErr) {
    console.warn('Stream decompression fallback error:', fallbackErr);
  }

  // Method 3: Raw printable words fallback
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const latin = new TextDecoder('latin1').decode(bytes);
    const rawWords = latin.match(/[A-Za-z0-9#+.]{2,}/g) || [];
    if (rawWords.length > 30) {
      return rawWords.join(' ');
    }
  } catch (e) {
    // Ignore
  }

  return '';
}

/**
 * Client-side text extractor supporting raw text, basic PDF text streams, and file objects
 */
export async function extractTextFromResumeFile(file) {
  if (!file) return '';

  // 1. Plain text / data URL
  if (typeof file === 'string') {
    if (file.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = file.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const extracted = await parsePdfArrayBuffer(bytes.buffer);
        if (extracted && extracted.trim().length > 20) return extracted;
      } catch (err) {
        console.warn('Error reading base64 PDF dataUrl:', err);
      }
    }
    return file;
  }

  const fileName = file.name ? file.name.toLowerCase() : '';

  // 2. Text / Markdown / CSV / JSON
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json') || file.type === 'text/plain') {
    return await file.text();
  }

  // 3. PDF file
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const extracted = await parsePdfArrayBuffer(arrayBuffer);
      if (extracted && extracted.trim().length > 20) {
        return extracted;
      }
    } catch (err) {
      console.warn('PDF extraction error:', err);
    }
  }

  // 4. DOCX / fallback text buffer
  try {
    const textBuffer = await file.text();
    if (textBuffer && textBuffer.length > 50) {
      return textBuffer;
    }
  } catch (err) {
    console.warn('Standard text read error:', err);
  }

  return `${file.name || 'Resume Document'} candidate profile with technical experience in software engineering and web development`;
}

/**
 * Extracts skills from text based on taxonomy
 */
export function extractSkillsFromText(rawText) {
  const norm = normalizeText(rawText);
  const foundSkills = new Set();

  ALL_CANONICAL_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s,.;()/-])${escaped}([\\s,.;()/-]|$)`, 'i');
    if (regex.test(norm)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
}

/**
 * Infer requirements for a target role from title, optional description, or manual custom inputs
 */
export function getRoleRequirements(roleTitle, jobDescription = '', manualRequirements = null) {
  // If manual requirements are provided and enabled by the user
  if (manualRequirements && manualRequirements.enabled) {
    const rawCore = Array.isArray(manualRequirements.coreSkills) ? manualRequirements.coreSkills : [];
    const rawSecondary = Array.isArray(manualRequirements.secondarySkills) ? manualRequirements.secondarySkills : [];
    
    // Normalize user-supplied skills
    const cleanedCore = rawCore
      .map(s => String(s).toLowerCase().trim())
      .filter(s => s.length > 0);

    const cleanedSecondary = rawSecondary
      .map(s => String(s).toLowerCase().trim())
      .filter(s => s.length > 0 && !cleanedCore.includes(s));

    // Experience: respect user's manual input if specified, or infer from title
    let minYears = typeof manualRequirements.minYears === 'number' ? manualRequirements.minYears : 2;

    return {
      targetTitle: roleTitle,
      expectedMinYears: Math.max(0, minYears),
      coreSkills: Array.from(new Set(cleanedCore)),
      secondarySkills: Array.from(new Set(cleanedSecondary)),
      isManual: true
    };
  }

  // Otherwise: System Automatic Mode
  const normalizedTitle = normalizeText(roleTitle);
  const normalizedDesc = normalizeText(jobDescription);

  let inferredCore = new Set();
  let inferredSecondary = new Set();
  let expectedMinYears = 2;

  // Seniority detection
  if (normalizedTitle.includes('senior') || normalizedTitle.includes('lead') || normalizedTitle.includes('principal') || normalizedTitle.includes('architect') || normalizedTitle.includes('staff')) {
    expectedMinYears = 5;
  } else if (normalizedTitle.includes('junior') || normalizedTitle.includes('associate') || normalizedTitle.includes('entry') || normalizedTitle.includes('intern')) {
    expectedMinYears = 0;
  } else if (normalizedTitle.includes('mid')) {
    expectedMinYears = 3;
  }

  // Match archetypes
  Object.keys(ROLE_ARCHETYPES).forEach(key => {
    if (normalizedTitle.includes(key)) {
      const arch = ROLE_ARCHETYPES[key];
      arch.coreSkills.forEach(s => inferredCore.add(s));
      arch.secondarySkills.forEach(s => inferredSecondary.add(s));
    }
  });

  // Extract explicit skills found in the job description
  if (jobDescription && jobDescription.trim().length > 10) {
    const descSkills = extractSkillsFromText(jobDescription);
    descSkills.forEach((s, idx) => {
      if (idx < 8) inferredCore.add(s);
      else inferredSecondary.add(s);
    });
  }

  // Fallback defaults if title was novel
  if (inferredCore.size === 0) {
    inferredCore = new Set(['javascript', 'react', 'git', 'sql', 'rest api', 'problem solving', 'team collaboration']);
    inferredSecondary = new Set(['typescript', 'docker', 'agile', 'responsive design']);
  }

  return {
    targetTitle: roleTitle,
    expectedMinYears,
    coreSkills: Array.from(inferredCore),
    secondarySkills: Array.from(inferredSecondary).filter(s => !inferredCore.has(s)),
    isManual: false
  };
}

/**
 * Helper to get suggested skills for a given role title to pre-populate manual requirements
 */
export function getSuggestedSkillsForRole(roleTitle) {
  const normTitle = normalizeText(roleTitle);
  const suggested = new Set();

  Object.keys(ROLE_ARCHETYPES).forEach(key => {
    if (normTitle.includes(key)) {
      ROLE_ARCHETYPES[key].coreSkills.forEach(s => suggested.add(s));
      ROLE_ARCHETYPES[key].secondarySkills.forEach(s => suggested.add(s));
    }
  });

  if (suggested.size === 0) {
    ['react', 'javascript', 'typescript', 'node.js', 'sql', 'git', 'docker', 'rest api', 'tailwind', 'python'].forEach(s => suggested.add(s));
  }

  return Array.from(suggested);
}

/**
 * Detects estimated years of experience from resume text
 */
export function estimateExperienceYears(resumeText) {
  const norm = normalizeText(resumeText);
  let maxYears = 0;

  // Check explicit phrases like "5+ years of experience", "4 yrs experience"
  const expPatterns = [
    /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/gi,
    /experience\s*(?:of|:)?\s*(\d{1,2})\+?\s*(?:years?|yrs?)/gi,
    /(\d{1,2})\+?\s*(?:years?|yrs?)\s+in/gi
  ];

  expPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(norm)) !== null) {
      const y = parseInt(match[1], 10);
      if (y > 0 && y <= 35 && y > maxYears) {
        maxYears = y;
      }
    }
  });

  // Check date ranges (e.g. 2019 - 2024, 2021 - Present)
  const currentYear = new Date().getFullYear();
  const yearRangeRegex = /(?:20\d{2}|19\d{2})\s*(?:-|–|to)\s*(?:present|current|20\d{2})/gi;
  const matches = norm.match(yearRangeRegex);
  if (matches && matches.length > 0) {
    let earliest = currentYear;
    matches.forEach(m => {
      const start = parseInt(m.match(/20\d{2}|19\d{2}/)[0], 10);
      if (start < earliest && start >= 1990) {
        earliest = start;
      }
    });
    const calculatedYears = currentYear - earliest;
    if (calculatedYears > maxYears && calculatedYears <= 35) {
      maxYears = calculatedYears;
    }
  }

  // Default fallback if no dates detected
  return maxYears > 0 ? maxYears : 2;
}

/**
 * Detects presence of quantifiable impact metrics (e.g. "improved by 40%", "$500k", "scaled to 1M users")
 */
export function evaluateImpactMetrics(resumeText) {
  const norm = normalizeText(resumeText);
  const metricRegex = /(\d+%\s*(?:increase|decrease|growth|improvement|reduction)?|\$\d+[\w]*|\d+\s*(?:million|thousand|k|m|users|clients|requests|transactions))/gi;
  const matches = norm.match(metricRegex) || [];
  return Math.min(100, matches.length * 20);
}

/**
 * Comprehensive Multi-Factor AI Evaluation Engine
 * Calculates weighted score, matches, gaps, and recommendations.
 */
export async function calculateResumeRoleMatch({ 
  resumeText, 
  roleTitle, 
  jobDescription = '', 
  candidateName = 'Candidate',
  manualRequirements = null
}) {
  const normResume = normalizeText(resumeText);
  const requirements = getRoleRequirements(roleTitle, jobDescription, manualRequirements);
  const resumeSkills = extractSkillsFromText(resumeText);
  const resumeSkillsSet = new Set(resumeSkills);

  // Helper to check if a required skill is present in the resume
  const isSkillMatched = (skill) => {
    const s = skill.toLowerCase().trim();
    if (!s) return false;
    
    // Direct match from taxonomy extraction
    if (resumeSkillsSet.has(s)) return true;
    
    // Direct word boundary regex match in normalized resume
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordBoundaryRegex = new RegExp(`(^|[\\s,.;():/\\-_#+])${escaped}([\\s,.;():/\\-_#+]|$)`, 'i');
    if (wordBoundaryRegex.test(normResume)) return true;

    // Substring match for terms with 3 or more chars
    if (s.length >= 3 && normResume.includes(s)) return true;

    // Common synonyms & technical variations
    if (s === 'springboot' || s === 'spring boot') {
      if (normResume.includes('spring boot') || normResume.includes('springboot') || normResume.includes('spring')) return true;
    }
    if (s === 'react' || s === 'reactjs' || s === 'react.js') {
      if (normResume.includes('react') || normResume.includes('react.js') || normResume.includes('reactjs')) return true;
    }
    if (s === 'mongodb' || s === 'mongo db' || s === 'mongo') {
      if (normResume.includes('mongodb') || normResume.includes('mongo db') || normResume.includes('mongo')) return true;
    }
    if (s === 'html' || s === 'html5') {
      if (normResume.includes('html') || normResume.includes('html5')) return true;
    }
    if (s === 'css' || s === 'css3') {
      if (normResume.includes('css') || normResume.includes('css3')) return true;
    }
    if (s === 'javascript' || s === 'js') {
      if (normResume.includes('javascript') || normResume.includes(' js ') || normResume.includes('es6')) return true;
    }
    if (s === 'typescript' || s === 'ts') {
      if (normResume.includes('typescript') || normResume.includes(' ts ')) return true;
    }
    if (s === 'node' || s === 'node.js' || s === 'nodejs') {
      if (normResume.includes('node') || normResume.includes('node.js') || normResume.includes('nodejs')) return true;
    }
    if (s === 'ai') {
      if (normResume.includes(' ai ') || normResume.includes('artificial intelligence') || normResume.includes('machine learning') || normResume.includes('deep learning')) return true;
    }

    return false;
  };

  // 1. Core Skills Match
  const matchedCoreSkills = requirements.coreSkills.filter(skill => isSkillMatched(skill));
  const missingCoreSkills = requirements.coreSkills.filter(skill => !isSkillMatched(skill));
  
  const matchedSecondarySkills = requirements.secondarySkills.filter(skill => isSkillMatched(skill));
  const missingSecondarySkills = requirements.secondarySkills.filter(skill => !isSkillMatched(skill));

  const allMatchedSkills = [...matchedCoreSkills, ...matchedSecondarySkills];
  const allMissingSkills = [...missingCoreSkills, ...missingSecondarySkills];

  // Core skills weight: 70%, Secondary: 30% (if manual requirements has only core skills, core weight is 100%)
  const hasSecondary = requirements.secondarySkills.length > 0;
  const coreScore = requirements.coreSkills.length > 0 
    ? (matchedCoreSkills.length / requirements.coreSkills.length) * 100 
    : 80;
  const secondaryScore = hasSecondary 
    ? (matchedSecondarySkills.length / requirements.secondarySkills.length) * 100 
    : 70;
    
  const skillsMatchScore = hasSecondary
    ? Math.round((coreScore * 0.7) + (secondaryScore * 0.3))
    : Math.round(coreScore);

  // 2. Role & Title Semantic Alignment
  const normTitleWords = normalizeText(roleTitle).split(' ').filter(w => w.length > 2);
  let titleMatches = 0;
  normTitleWords.forEach(w => {
    if (normResume.includes(w)) titleMatches++;
  });
  const roleAlignmentScore = normTitleWords.length > 0 
    ? Math.min(100, Math.round((titleMatches / normTitleWords.length) * 90) + (allMatchedSkills.length > 5 ? 10 : 0))
    : 75;

  // 3. Experience & Seniority Fit
  const detectedYears = estimateExperienceYears(resumeText);
  const reqYears = requirements.expectedMinYears;
  let experienceFitScore = 80;
  if (detectedYears >= reqYears) {
    experienceFitScore = Math.min(100, 85 + (detectedYears - reqYears) * 5);
  } else {
    experienceFitScore = Math.max(45, Math.round((detectedYears / (reqYears || 1)) * 80));
  }

  // 4. ATS Optimization & Keyword Density
  const totalWords = normResume.split(' ').filter(Boolean).length;
  let atsScore = 70;
  if (totalWords >= 250 && totalWords <= 1200) atsScore += 15;
  if (normResume.includes('education') || normResume.includes('bachelor') || normResume.includes('university') || normResume.includes('degree')) atsScore += 5;
  if (normResume.includes('experience') || normResume.includes('projects') || normResume.includes('work')) atsScore += 5;
  if (normResume.includes('skills') || normResume.includes('technologies')) atsScore += 5;
  atsScore = Math.min(100, atsScore);

  // 5. Impact & Achievements Metrics
  const impactScore = evaluateImpactMetrics(resumeText);

  // Weighted Overall Composite Match Score (0 - 100)
  // Skills: 40%, Role Alignment: 20%, Experience: 20%, ATS: 10%, Impact: 10%
  const compositeScore = Math.round(
    (skillsMatchScore * 0.40) +
    (roleAlignmentScore * 0.20) +
    (experienceFitScore * 0.20) +
    (atsScore * 0.10) +
    (impactScore * 0.10)
  );

  // Determine Match Rating tier
  let rating = 'Moderate Fit';
  let ratingColor = 'text-amber-700 bg-amber-50 border-amber-300';
  let badgeLabel = 'Good Alignment';

  if (compositeScore >= 85) {
    rating = 'Exceptional Match';
    ratingColor = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    badgeLabel = 'Top Candidate';
  } else if (compositeScore >= 70) {
    rating = 'Strong Match';
    ratingColor = 'text-teal-800 bg-teal-50 border-teal-300';
    badgeLabel = 'Competitive Profile';
  } else if (compositeScore >= 50) {
    rating = 'Moderate Fit';
    ratingColor = 'text-amber-800 bg-amber-50 border-amber-300';
    badgeLabel = 'Potential Fit with Skill Gaps';
  } else {
    rating = 'Low Alignment';
    ratingColor = 'text-rose-800 bg-rose-50 border-rose-300';
    badgeLabel = 'Requires Optimization';
  }

  // Generate Actionable AI Recommendations
  const recommendations = [];

  if (missingCoreSkills.length > 0) {
    const topMissing = missingCoreSkills.slice(0, 3).map(s => `"${s.toUpperCase()}"`).join(', ');
    recommendations.push({
      type: 'skill_gap',
      title: requirements.isManual ? 'Missing Custom Required Skills' : 'Address Critical Skill Gaps',
      description: requirements.isManual
        ? `Your resume is missing custom required skills you specified: ${topMissing}. Highlight these in your resume or project list to improve your match.`
        : `Add projects or experience demonstrating knowledge of ${topMissing} to significantly boost your score for this role.`,
      impact: '+12% Match Score Potential'
    });
  }

  if (!normResume.includes(normalizeText(roleTitle))) {
    recommendations.push({
      type: 'title_alignment',
      title: 'Align Resume Headline / Professional Summary',
      description: `Incorporate the exact role title "${roleTitle}" into your resume summary and objective statement to improve ATS ranking.`,
      impact: '+8% ATS Keyword Boost'
    });
  }

  if (impactScore < 60) {
    recommendations.push({
      type: 'quantifiable_impact',
      title: 'Quantify Work Achievements',
      description: 'Include concrete metrics (e.g. "% performance gained", "reduced latency by X ms", or "supported Y daily active users") in your work bullet points.',
      impact: '+10% Hiring Manager Appeal'
    });
  }

  if (matchedCoreSkills.length > 0) {
    recommendations.push({
      type: 'strength',
      title: 'Strong Core Alignment Identified',
      description: `Your strong background in ${matchedCoreSkills.slice(0, 3).map(s => s.toUpperCase()).join(', ')} directly aligns with what is required for this position.`,
      impact: 'Core Strength'
    });
  }

  return {
    roleTitle,
    compositeScore: Math.min(99, Math.max(25, compositeScore)),
    rating,
    ratingColor,
    badgeLabel,
    detectedYears,
    expectedYears: requirements.expectedMinYears,
    isManualRequirements: !!requirements.isManual,
    metrics: {
      skillsMatch: skillsMatchScore,
      roleAlignment: roleAlignmentScore,
      experienceFit: experienceFitScore,
      atsOptimization: atsScore,
      impactScore: Math.max(40, impactScore)
    },
    matchedSkills: allMatchedSkills,
    missingSkills: allMissingSkills,
    matchedCoreCount: matchedCoreSkills.length,
    totalCoreCount: requirements.coreSkills.length,
    recommendations,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
