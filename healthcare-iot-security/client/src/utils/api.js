// API Client - Uses environment variables for backend connection
// Currently not used (frontend works standalone with localStorage)
// Can be enabled for future backend integration

const API_BASE = import.meta.env.VITE_API_URL || '';

export const API = {
  baseUrl: API_BASE,

  // Check if backend is configured
  isConfigured() {
    return !!API_BASE && API_BASE !== 'http://localhost:4000';
  },

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    if (!API_BASE) {
      console.warn('Backend not configured - VITE_API_URL not set');
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('API request failed:', e);
      return null;
    }
  },

  // Device endpoints
  async getDevices() {
    return this.request('/api/devices');
  },

  async createDevice(device) {
    return this.request('/api/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  },

  // Encryption endpoints
  async encrypt(plaintext, passphrase) {
    return this.request('/api/encrypt', {
      method: 'POST',
      body: JSON.stringify({ plaintext, passphrase }),
    });
  },

  async decrypt(ciphertext, passphrase) {
    return this.request('/api/decrypt', {
      method: 'POST',
      body: JSON.stringify({ ciphertext, passphrase }),
    });
  },

  // ML classification
  async classifyFlow(features) {
    return this.request('/api/ml/classify', {
      method: 'POST',
      body: JSON.stringify(features),
    });
  },

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  },
};

export default API;
