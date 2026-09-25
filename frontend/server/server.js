import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS and JSON parsing
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));

// Preflight CORS handler for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Ensure database/data directory exists
const dbDir = process.env.DATA_DIR || path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Resilient Storage Engine: SQLite with JSON File persistence fallback
let useSqlite = false;
let sqliteDb = null;
const jsonDbPath = path.join(dbDir, 'careerplus.json');

try {
  const sqlite3Module = await import('sqlite3');
  const sqlite3 = (sqlite3Module.default || sqlite3Module).verbose();
  const dbPath = path.join(dbDir, 'careerplus.sqlite');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.warn('Native SQLite unavailable, using JSON file storage:', err.message);
      useSqlite = false;
    } else {
      useSqlite = true;
      console.log(`Connected to SQLite database at: ${dbPath}`);
      initSqliteTables();
    }
  });
} catch (err) {
  console.log('SQLite native module binding not found; using JSON file storage fallback.');
  useSqlite = false;
}

// JSON file database helper
function loadJsonStore() {
  if (!fs.existsSync(jsonDbPath)) {
    const initial = {
      applications: [],
      resumes: [
        {
          id: 'res-default-1',
          userId: 1,
          user_key: 'default',
          title: 'Senior Full Stack Resume',
          fileName: 'senior_full_stack_resume.pdf',
          fileSize: '1.2 MB',
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(jsonDbPath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(jsonDbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { applications: [], resumes: [] };
  }
}

function saveJsonStore(data) {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving JSON database:', e.message);
  }
}

function initSqliteTables() {
  if (!sqliteDb) return;
  sqliteDb.serialize(() => {
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        user_key TEXT,
        company TEXT,
        position TEXT,
        status TEXT,
        location TEXT,
        salary TEXT,
        appliedDate TEXT,
        notes TEXT,
        priority TEXT,
        contactPerson TEXT,
        jobUrl TEXT,
        payload TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_key TEXT,
        title TEXT,
        fileName TEXT,
        fileSize TEXT,
        dataUrl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database tables initialized successfully!');
  });
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Applications: GET /api/applications
app.get('/api/applications', (req, res) => {
  const { userKey, userEmail } = req.query;

  if (useSqlite && sqliteDb) {
    let sql = 'SELECT * FROM applications';
    let params = [];
    if (userKey && userKey !== 'all') {
      sql += ' WHERE user_key = ? OR user_key = "default"';
      params.push(userKey);
    }
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const parsed = rows.map(r => {
        if (r.payload) {
          try { return { ...JSON.parse(r.payload), id: r.id }; } catch(e) {}
        }
        return r;
      });
      res.json(parsed);
    });
  } else {
    const store = loadJsonStore();
    let apps = store.applications || [];
    if ((userKey && userKey !== 'all') || userEmail) {
      const qKey = (userKey || '').toLowerCase().trim();
      const qEmail = (userEmail || '').toLowerCase().trim();
      const qPrefix = qEmail.includes('@') ? qEmail.split('@')[0] : (qKey ? qKey.split('_')[0] : '');

      apps = apps.filter(app => {
        if (!app) return false;
        const appEmail = (app.userEmail || '').toLowerCase().trim();
        const appKey = (app.userKey || '').toLowerCase().trim();
        const appPrefix = appEmail.includes('@') ? appEmail.split('@')[0] : (appKey ? appKey.split('_')[0] : '');

        if (qEmail && appEmail === qEmail) return true;
        if (qKey && appKey === qKey) return true;
        if (qPrefix && appPrefix && (appPrefix === qPrefix || appPrefix.startsWith(qPrefix) || qPrefix.startsWith(appPrefix))) return true;
        return false;
      });
    }
    res.json(apps);
  }
});

// 2. Applications: POST /api/applications
app.post('/api/applications', (req, res) => {
  const job = req.body || {};
  const id = job.id || `job_${Date.now()}`;
  const userKey = job.userKey || (job.userEmail ? job.userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'default');
  const userEmail = job.userEmail || '';

  const newEntry = {
    ...job,
    id,
    userKey,
    userEmail
  };

  if (useSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO applications 
      (id, user_key, company, position, status, location, salary, appliedDate, notes, priority, contactPerson, jobUrl, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userKey,
      job.companyName || job.company || '',
      job.jobTitle || job.position || '',
      job.status || 'applied',
      job.location || '',
      job.offeredSalary || job.salary || '',
      job.appliedDate || new Date().toISOString(),
      job.notes || '',
      job.priorityLevel || job.priority || 'MEDIUM',
      job.recruiterName || job.contactPerson || '',
      job.companyWebsite || job.jobUrl || '',
      JSON.stringify(newEntry),
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id, ...newEntry });
      }
    );
    stmt.finalize();
  } else {
    const store = loadJsonStore();
    const existingIdx = (store.applications || []).findIndex(a => String(a.id) === String(id));
    if (existingIdx >= 0) {
      store.applications[existingIdx] = newEntry;
    } else {
      store.applications = [newEntry, ...(store.applications || [])];
    }
    saveJsonStore(store);
    res.status(201).json(newEntry);
  }
});

// 3. Applications: PUT /api/applications/:id
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body || {};

  if (useSqlite && sqliteDb) {
    sqliteDb.get('SELECT payload FROM applications WHERE id = ?', [id], (err, row) => {
      let merged = { id, ...updateData };
      if (row && row.payload) {
        try { merged = { ...JSON.parse(row.payload), ...updateData, id }; } catch(e) {}
      }
      sqliteDb.run(
        'UPDATE applications SET payload = ?, status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?',
        [JSON.stringify(merged), updateData.status, updateData.notes, id],
        function(updateErr) {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          res.json(merged);
        }
      );
    });
  } else {
    const store = loadJsonStore();
    const idx = (store.applications || []).findIndex(a => String(a.id) === String(id));
    if (idx >= 0) {
      store.applications[idx] = { ...store.applications[idx], ...updateData, id };
      saveJsonStore(store);
      res.json(store.applications[idx]);
    } else {
      const created = { id, ...updateData };
      store.applications.push(created);
      saveJsonStore(store);
      res.json(created);
    }
  }
});

// 4. Applications: DELETE /api/applications/:id
app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;

  if (useSqlite && sqliteDb) {
    sqliteDb.run('DELETE FROM applications WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deleted: this.changes });
    });
  } else {
    const store = loadJsonStore();
    store.applications = (store.applications || []).filter(a => String(a.id) !== String(id));
    saveJsonStore(store);
    res.json({ success: true, id });
  }
});

// 5. User Resumes: GET /api/users/resumes & /api/resumes
const handleGetResumes = (req, res) => {
  const { userKey, userEmail } = req.query;

  if (useSqlite && sqliteDb) {
    sqliteDb.all('SELECT * FROM resumes ORDER BY created_at DESC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  } else {
    const store = loadJsonStore();
    let resumes = store.resumes || [];
    if ((userKey && userKey !== 'all') || userEmail) {
      const qKey = (userKey || '').toLowerCase().trim();
      const qEmail = (userEmail || '').toLowerCase().trim();
      const qPrefix = qEmail.includes('@') ? qEmail.split('@')[0] : (qKey ? qKey.split('_')[0] : '');

      resumes = resumes.filter(r => {
        if (!r) return false;
        const rEmail = (r.userEmail || '').toLowerCase().trim();
        const rKey = (r.userKey || '').toLowerCase().trim();
        const rPrefix = rEmail.includes('@') ? rEmail.split('@')[0] : (rKey ? rKey.split('_')[0] : '');

        if (qEmail && rEmail === qEmail) return true;
        if (qKey && rKey === qKey) return true;
        if (qPrefix && rPrefix && (rPrefix === qPrefix || rPrefix.startsWith(qPrefix) || qPrefix.startsWith(rPrefix))) return true;
        return false;
      });
    }
    res.json(resumes);
  }
};
app.get('/api/users/resumes', handleGetResumes);
app.get('/api/resumes', handleGetResumes);

// 6. User Resumes: POST /api/users/resumes & /api/resumes
const handlePostResume = (req, res) => {
  const resumeData = req.body || {};
  const id = resumeData.id || `res-${Date.now()}`;
  const title = resumeData.title || 'My Resume';
  const fileName = resumeData.fileName || (title.replace(/\s+/g, '_').toLowerCase() + '.pdf');
  const fileSize = resumeData.fileSize || '1.2 MB';
  const dataUrl = resumeData.dataUrl || '';
  const userKey = resumeData.userKey || (resumeData.userEmail ? resumeData.userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'default');
  const userEmail = resumeData.userEmail || '';

  const newResume = {
    id,
    userKey,
    userEmail,
    title,
    fileName,
    fileSize,
    dataUrl,
    createdAt: new Date().toISOString()
  };

  if (useSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO resumes (id, user_key, title, fileName, fileSize, dataUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userKey, title, fileName, fileSize, dataUrl, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(newResume);
    });
    stmt.finalize();
  } else {
    const store = loadJsonStore();
    store.resumes = [newResume, ...(store.resumes || []).filter(r => String(r.id) !== String(id))];
    saveJsonStore(store);
    res.status(201).json(newResume);
  }
};
app.post('/api/users/resumes', handlePostResume);
app.post('/api/resumes', handlePostResume);

// 7. User Resumes: DELETE /api/users/resumes/:id & /api/resumes/:id
const handleDeleteResume = (req, res) => {
  const { id } = req.params;

  if (useSqlite && sqliteDb) {
    sqliteDb.run('DELETE FROM resumes WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id });
    });
  } else {
    const store = loadJsonStore();
    store.resumes = (store.resumes || []).filter(r => String(r.id) !== String(id));
    saveJsonStore(store);
    res.json({ success: true, id });
  }
};
app.delete('/api/users/resumes/:id', handleDeleteResume);
app.delete('/api/resumes/:id', handleDeleteResume);

// 8. Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const name = (email ? email.split('@')[0] : 'Candidate User');
  res.json({
    success: true,
    token: 'jwt-token-' + Date.now(),
    userId: 1,
    email: email || 'user@careerplus.io',
    fullName: name,
    user: { id: 1, email: email || 'user@careerplus.io', fullName: name, name: name }
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { fullName, email } = req.body || {};
  res.status(201).json({
    success: true,
    token: 'jwt-token-' + Date.now(),
    userId: 1,
    email: email || 'user@careerplus.io',
    fullName: fullName || 'Candidate',
    user: { id: 1, email: email || 'user@careerplus.io', fullName: fullName || 'Candidate', name: fullName || 'Candidate' }
  });
});

app.post('/api/auth/google', (req, res) => {
  const { email, fullName, name } = req.body || {};
  const userName = fullName || name || (email ? email.split('@')[0] : 'Google User');
  res.json({
    success: true,
    token: 'jwt-token-google-' + Date.now(),
    userId: 1,
    email: email || 'google_user@careerplus.io',
    fullName: userName,
    user: { id: 1, email: email || 'google_user@careerplus.io', fullName: userName, name: userName }
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  res.json({ success: true, message: 'Password reset link sent.' });
});

app.post('/api/auth/reset-password', (req, res) => {
  res.json({ success: true, message: 'Password has been reset successfully.' });
});

// Actions and Analytics endpoints
app.get('/api/applications/actions/today', (req, res) => {
  const store = loadJsonStore();
  res.json(store.applications || []);
});
app.get('/api/actions/today', (req, res) => {
  const store = loadJsonStore();
  res.json(store.applications || []);
});
app.get('/api/applications/analytics/insights', (req, res) => {
  const store = loadJsonStore();
  res.json({ total: (store.applications || []).length, applications: store.applications || [] });
});
app.get('/api/analytics/insights', (req, res) => {
  const store = loadJsonStore();
  res.json({ total: (store.applications || []).length, applications: store.applications || [] });
});

// 9. Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    database: useSqlite ? 'SQLite3' : 'Persistent Storage Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve Vite Production Build static files if available
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`CareerPlus Full-Stack Server running on port ${PORT}`);
  console.log(`Storage engine: ${useSqlite ? 'SQLite3' : 'JSON Persistent Store'}`);
  console.log(`==================================================`);
});
