/**
 * Metalayer — API Service Layer
 * Handles all backend communication for optimization, memory sync, and analytics
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_KEY  = import.meta.env.VITE_API_KEY || ''

class MetalayerAPI {
  constructor() {
    this.baseURL = API_BASE
    this.apiKey  = API_KEY
  }

  // ── HELPER: Make authenticated request ──
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed [${endpoint}]:`, error)
      throw error
    }
  }

  // ── OPTIMIZATION ──────────────────────────────────────────────────────────

  /**
   * Optimize a prompt with tone, memory, and routing
   * @param {Object} params
   * @param {string} params.prompt - Raw user prompt
   * @param {Object} params.tone - Tone settings { directness, warmth, formality, conciseness }
   * @param {Array}  params.memoryItems - Relevant memory items to inject
   * @param {string} params.targetModel - Routed model ID
   * @returns {Promise<Object>} { optimizedPrompt, metadata }
   */
  async optimizePrompt({ prompt, tone, memoryItems = [], targetModel }) {
    return this.request('/api/v1/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        tone,
        memory_items: memoryItems,
        target_model: targetModel,
      }),
    })
  }

  // ── MEMORY SYNC ───────────────────────────────────────────────────────────

  /**
   * Sync memory items to backend
   * @param {Array} items - Full memory item array
   * @returns {Promise<Object>} { synced: number, conflicts: [] }
   */
  async syncMemory(items) {
    return this.request('/api/v1/memory/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
  }

  /**
   * Retrieve memory items from backend
   * @returns {Promise<Array>} Array of memory items
   */
  async fetchMemory() {
    return this.request('/api/v1/memory')
  }

  /**
   * Perform semantic search across memory
   * @param {string} query - Search query
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Ranked memory items
   */
  async searchMemory(query, limit = 5) {
    return this.request('/api/v1/memory/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    })
  }

  // ── TONE PROFILES ─────────────────────────────────────────────────────────

  /**
   * Save tone profile to backend
   * @param {Object} profile - { name, directness, warmth, formality, conciseness }
   * @returns {Promise<Object>} Saved profile with ID
   */
  async saveToneProfile(profile) {
    return this.request('/api/v1/tone/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    })
  }

  /**
   * Fetch all saved tone profiles
   * @returns {Promise<Array>} Array of tone profiles
   */
  async fetchToneProfiles() {
    return this.request('/api/v1/tone/profiles')
  }

  // ── ROUTING ───────────────────────────────────────────────────────────────

  /**
   * Get routing recommendation for a prompt
   * @param {string} prompt - User prompt
   * @param {string} mode - 'auto' | 'manual'
   * @param {Array}  customRules - User's custom routing rules
   * @returns {Promise<Object>} { modelId, reason, taskType }
   */
  async getRoutingDecision(prompt, mode, customRules = []) {
    return this.request('/api/v1/routing/decide', {
      method: 'POST',
      body: JSON.stringify({ prompt, mode, custom_rules: customRules }),
    })
  }

  // ── ANALYTICS ─────────────────────────────────────────────────────────────

  /**
   * Log an optimization event
   * @param {Object} event
   * @returns {Promise<void>}
   */
  async logOptimization(event) {
    if (!import.meta.env.VITE_ENABLE_ANALYTICS) return
    return this.request('/api/v1/analytics/optimization', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  /**
   * Fetch user analytics summary
   * @param {number} days - Number of days to fetch
   * @returns {Promise<Object>} Analytics data
   */
  async fetchAnalytics(days = 30) {
    return this.request(`/api/v1/analytics?days=${days}`)
  }

  // ── HEALTH CHECK ──────────────────────────────────────────────────────────

  /**
   * Check API health
   * @returns {Promise<Object>} { status, version, uptime }
   */
  async healthCheck() {
    return this.request('/api/v1/health')
  }
}

// Export singleton instance
export const api = new MetalayerAPI()

// Export class for custom instances
export default MetalayerAPI
