/**
 * Metalayer — Global State Store
 * Zustand-based store covering all four core systems:
 * Tone Engine, Memory Engine, Prompt Optimizer, Model Routing
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ── TONE ENGINE STORE ─────────────────────────────────────────────────────────

const TONE_PRESETS = {
  executive: {
    name: 'Executive',
    description: 'Authoritative, concise, data-oriented',
    directness: 85, warmth: 40, formality: 90, conciseness: 88,
  },
  creative: {
    name: 'Creative',
    description: 'Expressive, nuanced, exploratory',
    directness: 55, warmth: 75, formality: 35, conciseness: 45,
  },
  technical: {
    name: 'Technical',
    description: 'Precise, structured, thorough',
    directness: 80, warmth: 30, formality: 75, conciseness: 70,
  },
  supportive: {
    name: 'Supportive',
    description: 'Warm, patient, collaborative',
    directness: 45, warmth: 90, formality: 50, conciseness: 55,
  },
  neutral: {
    name: 'Neutral',
    description: 'Balanced, adaptable, professional',
    directness: 65, warmth: 55, formality: 65, conciseness: 65,
  },
}

export const useToneStore = create(
  persist(
    (set, get) => ({
      // Active tone settings
      directness:  65,
      warmth:      55,
      formality:   65,
      conciseness: 65,
      activePreset: 'neutral',
      customProfiles: [],

      // Actions
      setSlider: (key, value) => set({ [key]: value, activePreset: 'custom' }),

      applyPreset: (presetKey) => {
        const preset = TONE_PRESETS[presetKey]
        if (!preset) return
        set({
          directness:  preset.directness,
          warmth:      preset.warmth,
          formality:   preset.formality,
          conciseness: preset.conciseness,
          activePreset: presetKey,
        })
      },

      saveCustomProfile: (name) => {
        const { directness, warmth, formality, conciseness, customProfiles } = get()
        const profile = {
          id:   Date.now().toString(),
          name,
          directness, warmth, formality, conciseness,
          createdAt: new Date().toISOString(),
        }
        set({ customProfiles: [...customProfiles, profile] })
        return profile
      },

      deleteCustomProfile: (id) => {
        set(state => ({
          customProfiles: state.customProfiles.filter(p => p.id !== id)
        }))
      },

      loadCustomProfile: (profile) => {
        set({
          directness:  profile.directness,
          warmth:      profile.warmth,
          formality:   profile.formality,
          conciseness: profile.conciseness,
          activePreset: 'custom',
        })
      },

      getPresets: () => TONE_PRESETS,

      // Compute a tone descriptor string from current settings
      getToneDescriptor: () => {
        const { directness, warmth, formality, conciseness } = get()
        const parts = []
        if (directness > 70) parts.push('direct')
        else if (directness < 40) parts.push('diplomatic')
        if (warmth > 70) parts.push('warm')
        else if (warmth < 35) parts.push('formal')
        if (formality > 70) parts.push('professional')
        else if (formality < 40) parts.push('conversational')
        if (conciseness > 70) parts.push('concise')
        else if (conciseness < 40) parts.push('detailed')
        return parts.length > 0 ? parts.join(', ') : 'balanced'
      },
    }),
    {
      name: 'metalayer-tone',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ── MEMORY ENGINE STORE ───────────────────────────────────────────────────────

const MEMORY_TYPES = ['project', 'preference', 'constraint', 'style', 'context', 'persona']

export const useMemoryStore = create(
  persist(
    (set, get) => ({
      items: [],
      searchQuery: '',
      activeFilter: 'all',

      // Add a memory item
      addItem: ({ type, content, tags = [] }) => {
        if (!MEMORY_TYPES.includes(type)) throw new Error(`Invalid type: ${type}`)
        const item = {
          id:        Date.now().toString(),
          type,
          content,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          retrievalCount: 0,
        }
        set(state => ({ items: [item, ...state.items] }))
        return item
      },

      // Update a memory item
      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          )
        }))
      },

      // Delete a memory item
      deleteItem: (id) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }))
      },

      // Retrieve items relevant to a query (simple keyword match)
      retrieveRelevant: (query) => {
        const { items } = get()
        const q = query.toLowerCase()
        const scored = items.map(item => {
          const text = `${item.content} ${item.tags.join(' ')}`.toLowerCase()
          let score = 0
          q.split(' ').forEach(word => {
            if (word.length > 2 && text.includes(word)) score++
          })
          return { item, score }
        })
        return scored
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(s => {
            // Increment retrieval count
            get().updateItem(s.item.id, { retrievalCount: s.item.retrievalCount + 1 })
            return s.item
          })
          .slice(0, 5)
      },

      // Search and filter
      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveFilter: (f) => set({ activeFilter: f }),

      getFilteredItems: () => {
        const { items, searchQuery, activeFilter } = get()
        return items.filter(item => {
          const matchesFilter = activeFilter === 'all' || item.type === activeFilter
          const matchesSearch = !searchQuery ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          return matchesFilter && matchesSearch
        })
      },

      getTypes: () => MEMORY_TYPES,
      getStats: () => {
        const { items } = get()
        const byType = MEMORY_TYPES.reduce((acc, type) => {
          acc[type] = items.filter(i => i.type === type).length
          return acc
        }, {})
        return { total: items.length, byType }
      },
    }),
    {
      name: 'metalayer-memory',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ── PROMPT OPTIMIZER STORE ────────────────────────────────────────────────────

export const useOptimizerStore = create(
  persist(
    (set, get) => ({
      history:      [],
      isOptimizing: false,

      // Optimize a prompt (client-side simulation — swap for real API call)
      optimizePrompt: async (rawPrompt) => {
        if (!rawPrompt.trim()) return null
        set({ isOptimizing: true })

        const { getToneDescriptor } = useToneStore.getState()
        const { retrieveRelevant }   = useMemoryStore.getState()
        const { getActiveRule }      = useRoutingStore.getState()

        const toneDesc      = getToneDescriptor()
        const relevantMem   = retrieveRelevant(rawPrompt)
        const routingModel  = getActiveRule(rawPrompt)

        // Simulate async optimization
        await new Promise(resolve => setTimeout(resolve, 900))

        const memContext = relevantMem.length > 0
          ? `\n\nContext from memory:\n${relevantMem.map(m => `- [${m.type}] ${m.content}`).join('\n')}`
          : ''

        const toneInstruction = `\n\nTone: ${toneDesc}. Apply this voice consistently throughout.`

        const formatInstructions = buildFormatInstructions(rawPrompt)

        const optimized = `${rawPrompt.trim()}${memContext}${toneInstruction}${formatInstructions}`

        const entry = {
          id:            Date.now().toString(),
          rawPrompt,
          optimizedPrompt: optimized,
          toneApplied:   toneDesc,
          memoryItems:   relevantMem.map(m => m.id),
          modelRouted:   routingModel,
          createdAt:     new Date().toISOString(),
        }

        set(state => ({
          history:      [entry, ...state.history].slice(0, 50),
          isOptimizing: false,
        }))

        return entry
      },

      clearHistory: () => set({ history: [] }),
      deleteEntry:  (id) => set(state => ({ history: state.history.filter(e => e.id !== id) })),
    }),
    {
      name: 'metalayer-optimizer',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
    }
  )
)

function buildFormatInstructions(prompt) {
  const lower = prompt.toLowerCase()
  if (lower.includes('summary') || lower.includes('summarize'))
    return '\n\nFormat: Concise summary (150–250 words). Lead with the main point. No filler.'
  if (lower.includes('email') || lower.includes('message'))
    return '\n\nFormat: Professional email. Subject line first. Clear opening, body, and call to action.'
  if (lower.includes('code') || lower.includes('function') || lower.includes('script'))
    return '\n\nFormat: Clean, commented code. Include usage example. Note any dependencies.'
  if (lower.includes('list') || lower.includes('steps') || lower.includes('how to'))
    return '\n\nFormat: Numbered steps. Each step: action + brief explanation. Maximum 8 steps.'
  if (lower.includes('analysis') || lower.includes('compare') || lower.includes('evaluate'))
    return '\n\nFormat: Structured analysis. Sections: Overview → Key Findings → Recommendation.'
  return '\n\nFormat: Clear, direct prose. Short paragraphs. Lead with the most important point.'
}

// ── MODEL ROUTING STORE ───────────────────────────────────────────────────────

const DEFAULT_MODELS = [
  {
    id: 'claude-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    strengths: ['writing', 'analysis', 'summarization', 'reasoning'],
    costTier: 'medium',
    speed: 'fast',
    contextWindow: 200000,
    description: 'Best for long-form writing, nuanced analysis, and prose quality.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    strengths: ['coding', 'debug', 'vision', 'broad-knowledge'],
    costTier: 'medium',
    speed: 'fast',
    contextWindow: 128000,
    description: 'Optimal for code generation, debugging, and multimodal tasks.',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    strengths: ['data', 'long-context', 'research', 'structured-output'],
    costTier: 'medium',
    speed: 'medium',
    contextWindow: 1000000,
    description: 'Ideal for large document analysis and structured data extraction.',
  },
  {
    id: 'claude-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    strengths: ['quick-qa', 'classification', 'simple-tasks'],
    costTier: 'low',
    speed: 'fastest',
    contextWindow: 200000,
    description: 'Fast and cost-efficient for simple queries and quick responses.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    strengths: ['quick-qa', 'extraction', 'simple-tasks'],
    costTier: 'low',
    speed: 'fastest',
    contextWindow: 128000,
    description: 'Lightweight model for high-volume simple tasks.',
  },
]

const TASK_KEYWORDS = {
  writing:         ['write', 'draft', 'compose', 'essay', 'blog', 'article', 'copy', 'email', 'summary'],
  coding:          ['code', 'function', 'script', 'debug', 'implement', 'refactor', 'api', 'bug'],
  data:            ['data', 'analyze', 'analyse', 'spreadsheet', 'csv', 'dataset', 'statistics'],
  research:        ['research', 'find', 'compare', 'evaluate', 'review', 'investigate'],
  'quick-qa':      ['what is', 'who is', 'when', 'where', 'define', 'explain briefly'],
}

export const useRoutingStore = create(
  persist(
    (set, get) => ({
      rules:         [],
      mode:          'auto',       // 'auto' | 'manual'
      defaultModel:  'claude-sonnet',
      routingLog:    [],

      setMode:         (mode) => set({ mode }),
      setDefaultModel: (id)   => set({ defaultModel: id }),

      addRule: ({ taskKeyword, modelId, priority = 0 }) => {
        const rule = {
          id:          Date.now().toString(),
          taskKeyword,
          modelId,
          priority,
          createdAt:   new Date().toISOString(),
        }
        set(state => ({
          rules: [...state.rules, rule].sort((a, b) => b.priority - a.priority)
        }))
        return rule
      },

      deleteRule: (id) => {
        set(state => ({ rules: state.rules.filter(r => r.id !== id) }))
      },

      updateRule: (id, updates) => {
        set(state => ({
          rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
        }))
      },

      // Determine which model to use for a given prompt
      getActiveRule: (prompt) => {
        const { mode, rules, defaultModel } = get()
        const lower = prompt.toLowerCase()

        // Check custom rules first
        for (const rule of rules) {
          if (lower.includes(rule.taskKeyword.toLowerCase())) {
            get().logRouting(prompt, rule.modelId, 'custom-rule', rule.taskKeyword)
            return rule.modelId
          }
        }

        if (mode === 'manual') {
          get().logRouting(prompt, defaultModel, 'manual-default', null)
          return defaultModel
        }

        // Auto-routing: detect task type from keywords
        for (const [taskType, keywords] of Object.entries(TASK_KEYWORDS)) {
          if (keywords.some(kw => lower.includes(kw))) {
            const model = DEFAULT_MODELS.find(m => m.strengths.includes(taskType))
            const modelId = model ? model.id : defaultModel
            get().logRouting(prompt, modelId, 'auto', taskType)
            return modelId
          }
        }

        get().logRouting(prompt, defaultModel, 'auto-fallback', null)
        return defaultModel
      },

      logRouting: (prompt, modelId, method, taskType) => {
        const entry = {
          id:        Date.now().toString(),
          prompt:    prompt.substring(0, 80),
          modelId,
          method,
          taskType,
          timestamp: new Date().toISOString(),
        }
        set(state => ({
          routingLog: [entry, ...state.routingLog].slice(0, 100)
        }))
      },

      getModels:     () => DEFAULT_MODELS,
      getModelById:  (id) => DEFAULT_MODELS.find(m => m.id === id),
    }),
    {
      name: 'metalayer-routing',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
