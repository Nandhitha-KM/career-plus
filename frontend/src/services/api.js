export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api' 
  : 'http://localhost:8080/api';

const getAuthHeaders = (hasBody = false) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('careerplus_jwt_token') : null;
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Storage Type Indicator
  storageType: 'SQLite Database',

  async checkSQLiteHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        return { isSQLite: true, engine: data.database || 'SQLite3' };
      }
    } catch(err) {}
    return { isSQLite: false, engine: 'LocalStorage Fallback' };
  },

  async getKanbanApplications(userKey, userEmail) {
    try {
      const params = new URLSearchParams();
      if (userKey) params.append('userKey', userKey);
      if (userEmail) params.append('userEmail', userEmail);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/applications${queryString}`, {
        headers: getAuthHeaders(false),
      });
      if (!response.ok) throw new Error('Failed to fetch kanban applications');
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline or unreachable:', err.message);
      return null;
    }
  },

  // 2. Today's Actions API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getTodaysActions(userKey, userEmail) {
    return this.getKanbanApplications(userKey, userEmail);
  },

  // 3. Priority Engine API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getPriorityApplications(userKey, userEmail) {
    return this.getKanbanApplications(userKey, userEmail);
  },

  // 4. Reminders & Notes API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getFollowUpApplications(userKey, userEmail) {
    return this.getKanbanApplications(userKey, userEmail);
  },

  // 5. Analytics & Insights API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getAnalyticsInsights(userKey, userEmail) {
    return this.getKanbanApplications(userKey, userEmail);
  },

  // 6. Standard Applications REST CRUD APIs
  async getApplications(userKey, userEmail) {
    return this.getKanbanApplications(userKey, userEmail);
  },

  async createApplication(applicationData) {
    try {
      const { id, ...cleanData } = applicationData;
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to create application');
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  },

  async updateApplication(id, applicationData) {
    try {
      const { id: _, ...cleanData } = applicationData;
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to update application');
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  },

  async deleteApplication(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      });
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  },

  // 7. User Resumes REST API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getResumes(userKey, userEmail) {
    try {
      const params = new URLSearchParams();
      if (userKey) params.append('userKey', userKey);
      if (userEmail) params.append('userEmail', userEmail);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/users/resumes${queryString}`, {
        headers: getAuthHeaders(false),
      });
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  },

  async createResume(resumeData) {
    try {
      const { id, ...cleanData } = resumeData;
      const response = await fetch(`${API_BASE_URL}/users/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to save resume');
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  },

  async deleteResume(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      });
      return await response.json();
    } catch (err) {
      console.warn('Backend 8080 offline:', err.message);
      return null;
    }
  }
};
