/**
 * Metalayer — Model Routing
 * Routing mode toggle, model overview, custom rules CRUD, routing decision log
 */

import React, { useState } from 'react'
import { useRoutingStore } from '@/lib/store'
import './ModelRouting.css'

const COST_COLORS = { low: 'var(--jade)', medium: 'var(--gold)', high: 'var(--rose)' }
const SPEED_COLORS = { fastest: 'var(--jade)', fast: 'var(--sky)', medium: 'var(--gold)', slow: 'var(--mute)' }

// ── MODEL CARD ────────────────────────────────────────────────────────────────

function ModelCard({ model, isDefault, onSetDefault }) {
  return (
    <div className={`model-card card card-hover ${isDefault ? 'model-card-default' : ''}`}>
      <div className="model-card-header">
        <div>
          <div className="model-card-name">{model.name}</div>
          <div className="model-card-provider">{model.provider}</div>
        </div>
        {isDefault && <span className="badge badge-accent">Default</span>}
      </div>
      <div className="model-card-desc">{model.description}</div>
      <div className="model-card-strengths">
        {model.strengths.map(s => (
          <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>
        ))}
      </div>
      <div className="model-card-footer">
        <div className="model-meta-item">
          <span className="model-meta-label">Cost</span>
          <span className="model-meta-val" style={{ color: COST_COLORS[model.costTier] }}>
            {model.costTier}
          </span>
        </div>
        <div className="model-meta-item">
          <span className="model-meta-label">Speed</span>
          <span className="model-meta-val" style={{ color: SPEED_COLORS[model.speed] }}>
            {model.speed}
          </span>
        </div>
        <div className="model-meta-item">
          <span className="model-meta-label">Context</span>
          <span className="model-meta-val">{(model.contextWindow / 1000).toFixed(0)}k</span>
        </div>
        {!isDefault && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => onSetDefault(model.id)}
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  )
}

// ── ADD RULE MODAL ────────────────────────────────────────────────────────────

function AddRuleModal({ models, onSave, onClose }) {
  const [keyword,  setKeyword]  = useState('')
  const [modelId,  setModelId]  = useState(models[0]?.id || '')
  const [priority, setPriority] = useState(0)
  const [error,    setError]    = useState('')

  const handleSave = () => {
    if (!keyword.trim()) { setError('Keyword is required.'); return }
    onSave({ taskKeyword: keyword.trim().toLowerCase(), modelId, priority: Number(priority) })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Routing Rule</h3>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="input-wrap" style={{ marginBottom: 14 }}>
            <label className="input-label">Trigger Keyword</label>
            <input
              className={`input ${error ? 'input-error' : ''}`}
              placeholder="e.g. email, refactor, blog, summary…"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setError('') }}
              autoFocus
            />
            {error && <span className="input-hint" style={{ color: 'var(--rose)' }}>{error}</span>}
            <span className="input-hint">When a prompt contains this word, route to the selected model.</span>
          </div>

          <div className="input-wrap" style={{ marginBottom: 14 }}>
            <label className="input-label">Route To</label>
            <select
              className="input select"
              value={modelId}
              onChange={e => setModelId(e.target.value)}
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
              ))}
            </select>
          </div>

          <div className="input-wrap">
            <label className="input-label">Priority (higher = checked first)</label>
            <input
              type="number"
              className="input"
              min={0} max={100}
              value={priority}
              onChange={e => setPriority(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Add Rule</button>
        </div>
      </div>
    </div>
  )
}

// ── ROUTING LOG ───────────────────────────────────────────────────────────────

function RoutingLog({ log, getModelById }) {
  if (log.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '32px 24px' }}>
        <div className="empty-state-icon">⇌</div>
        <div className="empty-state-title">No routing decisions yet</div>
        <div className="empty-state-body">Decisions will appear here each time a prompt is optimized.</div>
      </div>
    )
  }

  const methodColor = {
    'auto':          'var(--jade)',
    'auto-fallback': 'var(--gold)',
    'custom-rule':   'var(--accent-lt)',
    'manual-default':'var(--sky)',
  }

  return (
    <div className="routing-log-list">
      {log.slice(0, 20).map(entry => {
        const model = getModelById(entry.modelId)
        return (
          <div key={entry.id} className="routing-log-item">
            <div className="routing-log-prompt">{entry.prompt}{entry.prompt.length >= 80 ? '…' : ''}</div>
            <div className="routing-log-meta">
              <span className="routing-log-model">{model?.name || entry.modelId}</span>
              <span
                className="badge"
                style={{
                  background: `${methodColor[entry.method]}15`,
                  borderColor: `${methodColor[entry.method]}30`,
                  color: methodColor[entry.method],
                  fontSize: 9,
                }}
              >
                {entry.method}
              </span>
              {entry.taskType && (
                <span className="routing-log-task">{entry.taskType}</span>
              )}
              <span className="routing-log-time">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MAIN MODEL ROUTING ────────────────────────────────────────────────────────

export default function ModelRouting() {
  const {
    mode, defaultModel, rules, routingLog,
    setMode, setDefaultModel, addRule, deleteRule, updateRule,
    getModels, getModelById,
  } = useRoutingStore()

  const [activeTab,   setActiveTab]   = useState('models')
  const [showRuleModal, setShowRuleModal] = useState(false)

  const models = getModels()

  return (
    <div className="model-routing animate-fade-up">
      {showRuleModal && (
        <AddRuleModal
          models={models}
          onSave={addRule}
          onClose={() => setShowRuleModal(false)}
        />
      )}

      {/* Header */}
      <div className="routing-header">
        <div>
          <h2 className="routing-title">Model Routing</h2>
          <p className="routing-sub">
            Route every task to the optimal AI model — automatically based on task detection,
            or manually via custom keyword rules.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="routing-mode-toggle">
          <span className="routing-mode-label">Mode</span>
          <div className="routing-mode-buttons">
            <button
              className={`routing-mode-btn ${mode === 'auto' ? 'active' : ''}`}
              onClick={() => setMode('auto')}
            >
              Auto
            </button>
            <button
              className={`routing-mode-btn ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Mode description */}
      <div className="routing-mode-info">
        {mode === 'auto' ? (
          <span>
            <strong style={{ color: 'var(--jade)' }}>Auto mode active.</strong>{' '}
            Metalayer detects task type from your prompt and routes to the best available model.
            Custom rules take priority over auto-detection.
          </span>
        ) : (
          <span>
            <strong style={{ color: 'var(--gold)' }}>Manual mode active.</strong>{' '}
            All prompts route to your default model unless a custom rule matches.
            Default: <strong style={{ color: 'var(--text)' }}>{getModelById(defaultModel)?.name}</strong>.
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="routing-tabs">
        {[
          { id: 'models', label: 'Models' },
          { id: 'rules',  label: `Rules (${rules.length})` },
          { id: 'log',    label: `Log (${routingLog.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            className={`routing-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Models tab */}
      {activeTab === 'models' && (
        <div className="routing-models-grid animate-fade-in">
          {models.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              isDefault={defaultModel === model.id}
              onSetDefault={setDefaultModel}
            />
          ))}
        </div>
      )}

      {/* Rules tab */}
      {activeTab === 'rules' && (
        <div className="animate-fade-in">
          <div className="routing-rules-header">
            <p style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 300 }}>
              Custom rules are checked first. When a prompt contains the trigger keyword,
              it routes to the specified model regardless of mode.
            </p>
            <button className="btn btn-primary" onClick={() => setShowRuleModal(true)}>
              + Add Rule
            </button>
          </div>

          {rules.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 32 }}>
              <div className="empty-state-icon">⇌</div>
              <div className="empty-state-title">No custom rules</div>
              <div className="empty-state-body">
                Add rules to override auto-routing for specific keywords or task types.
              </div>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowRuleModal(true)}>
                Add First Rule
              </button>
            </div>
          ) : (
            <div className="routing-rules-list">
              <div className="routing-rules-table-head">
                <span>Keyword</span>
                <span>Route To</span>
                <span>Priority</span>
                <span/>
              </div>
              {rules.map(rule => {
                const model = getModelById(rule.modelId)
                return (
                  <div key={rule.id} className="routing-rule-row">
                    <div className="routing-rule-keyword">
                      <code style={{ fontSize: 13, background: 'var(--s3)', padding: '2px 8px', borderRadius: 4, color: 'var(--accent-lt)' }}>
                        {rule.taskKeyword}
                      </code>
                    </div>
                    <div className="routing-rule-model">
                      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{model?.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--mute)' }}>{model?.provider}</span>
                    </div>
                    <div>
                      <span className="badge badge-muted">{rule.priority}</span>
                    </div>
                    <div className="routing-rule-actions">
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => deleteRule(rule.id)}
                        title="Delete rule"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Log tab */}
      {activeTab === 'log' && (
        <div className="animate-fade-in">
          <div className="routing-rules-header">
            <p style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 300 }}>
              Every routing decision logged with method, task type, and model selected.
            </p>
          </div>
          <div className="card" style={{ overflow: 'hidden', marginTop: 12 }}>
            <RoutingLog log={routingLog} getModelById={getModelById} />
          </div>
        </div>
      )}
    </div>
  )
}
