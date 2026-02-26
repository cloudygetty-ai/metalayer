/**
 * Metalayer — Prompt Optimizer
 * Raw prompt input → tone + memory enriched output with history
 */

import React, { useState } from 'react'
import { useOptimizerStore, useToneStore, useMemoryStore } from '@/lib/store'
import './PromptOptimizer.css'

// ── HISTORY ITEM ──────────────────────────────────────────────────────────────

function HistoryItem({ entry, onSelect }) {
  const timeAgo = (iso) => {
    const diff  = Date.now() - new Date(iso).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (mins < 1)  return 'Just now'
    if (mins < 60) return `${mins}m ago`
    return `${hours}h ago`
  }

  return (
    <button className="optimizer-history-item" onClick={() => onSelect(entry)}>
      <div className="optimizer-history-prompt">{entry.rawPrompt}</div>
      <div className="optimizer-history-meta">
        <span className="badge badge-accent" style={{ fontSize: 9 }}>
          {entry.toneApplied}
        </span>
        <span className="optimizer-history-model">{entry.modelRouted}</span>
        <span className="optimizer-history-time">{timeAgo(entry.createdAt)}</span>
      </div>
    </button>
  )
}

// ── DIFF VIEW ─────────────────────────────────────────────────────────────────

function OptimizedResult({ entry, onCopy, onClear }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.optimizedPrompt)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  // Split the optimized prompt into the base and the injected sections
  const lines = entry.optimizedPrompt.split('\n\n')

  return (
    <div className="optimizer-result animate-fade-up">
      <div className="optimizer-result-header">
        <div className="optimizer-result-meta">
          <span className="badge badge-jade">Optimized</span>
          <span className="badge badge-accent">{entry.toneApplied}</span>
          <span className="badge badge-sky">{entry.modelRouted}</span>
          {entry.memoryItems.length > 0 && (
            <span className="badge badge-gold">{entry.memoryItems.length} memory item{entry.memoryItems.length > 1 ? 's' : ''} injected</span>
          )}
        </div>
        <div className="optimizer-result-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClear}>Clear</button>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy Prompt'}
          </button>
        </div>
      </div>

      <div className="optimizer-result-body">
        {lines.map((line, i) => {
          if (!line.trim()) return null
          const isInjected = i > 0
          return (
            <div
              key={i}
              className={`optimizer-result-line ${isInjected ? 'injected' : 'original'}`}
            >
              {isInjected && (
                <span className="optimizer-injection-label">
                  {line.startsWith('Context from memory') ? '🧠 Memory'
                   : line.startsWith('Tone:')             ? '🎚 Tone'
                   : line.startsWith('Format:')           ? '⚙ Format'
                   : '◈ Injected'}
                </span>
              )}
              <pre className="optimizer-result-text">{line}</pre>
            </div>
          )
        })}
      </div>

      <div className="optimizer-result-footer">
        <div className="optimizer-stat">
          <span className="optimizer-stat-label">Original length</span>
          <span className="optimizer-stat-val">{entry.rawPrompt.length} chars</span>
        </div>
        <div className="optimizer-stat">
          <span className="optimizer-stat-label">Optimized length</span>
          <span className="optimizer-stat-val">{entry.optimizedPrompt.length} chars</span>
        </div>
        <div className="optimizer-stat">
          <span className="optimizer-stat-label">Enhancement</span>
          <span className="optimizer-stat-val" style={{ color: 'var(--jade)' }}>
            +{Math.round(((entry.optimizedPrompt.length / entry.rawPrompt.length) - 1) * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PROMPT OPTIMIZER ─────────────────────────────────────────────────────

export default function PromptOptimizer() {
  const { history, isOptimizing, optimizePrompt, deleteEntry, clearHistory } = useOptimizerStore()
  const { getToneDescriptor } = useToneStore()
  const { getStats }          = useMemoryStore()

  const [rawPrompt,    setRawPrompt]    = useState('')
  const [activeResult, setActiveResult] = useState(null)
  const [showHistory,  setShowHistory]  = useState(false)

  const toneDesc   = getToneDescriptor()
  const memStats   = getStats()

  const handleOptimize = async () => {
    if (!rawPrompt.trim() || isOptimizing) return
    const entry = await optimizePrompt(rawPrompt)
    if (entry) {
      setActiveResult(entry)
      setRawPrompt('')
    }
  }

  const handleSelectHistory = (entry) => {
    setActiveResult(entry)
    setShowHistory(false)
  }

  return (
    <div className="prompt-optimizer animate-fade-up">
      {/* Header */}
      <div className="optimizer-header">
        <div>
          <h2 className="optimizer-title">Prompt Optimizer</h2>
          <p className="optimizer-sub">
            Write your intention. Metalayer applies your tone, injects relevant memory, and structures
            the prompt for maximum precision before it reaches any model.
          </p>
        </div>
        <div className="optimizer-header-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setShowHistory(s => !s)}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {/* Active context indicators */}
      <div className="optimizer-context-bar">
        <div className="optimizer-context-item">
          <span className="optimizer-context-label">Tone</span>
          <span className="optimizer-context-value" style={{ color: 'var(--accent-lt)' }}>
            {toneDesc}
          </span>
        </div>
        <div className="optimizer-context-divider"/>
        <div className="optimizer-context-item">
          <span className="optimizer-context-label">Memory items</span>
          <span className="optimizer-context-value" style={{ color: 'var(--jade)' }}>
            {memStats.total} available
          </span>
        </div>
        <div className="optimizer-context-divider"/>
        <div className="optimizer-context-item">
          <span className="optimizer-context-label">Model routing</span>
          <span className="optimizer-context-value" style={{ color: 'var(--sky)' }}>Auto</span>
        </div>
      </div>

      <div className="optimizer-layout">
        {/* Input panel */}
        <div className="optimizer-input-panel">
          <div className="section-label">Raw Prompt</div>

          <textarea
            className="input textarea optimizer-textarea"
            placeholder={
              `Write your idea, question, or task naturally.\n\n` +
              `Examples:\n` +
              `— "Write a summary of our Q3 results for the board"\n` +
              `— "Draft an email to Sarah about the project delay"\n` +
              `— "Refactor this function to be more readable"`
            }
            value={rawPrompt}
            onChange={e => setRawPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleOptimize()
            }}
            rows={7}
          />

          <div className="optimizer-input-footer">
            <span className="optimizer-char-count">
              {rawPrompt.length > 0 ? `${rawPrompt.length} chars` : ''}
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--mute)' }}>⌘ + Enter to optimize</span>
              <button
                className="btn btn-primary"
                onClick={handleOptimize}
                disabled={!rawPrompt.trim() || isOptimizing}
              >
                {isOptimizing ? (
                  <span className="optimizer-loading">
                    <span className="optimizer-loading-dot"/>
                    <span className="optimizer-loading-dot"/>
                    <span className="optimizer-loading-dot"/>
                    Optimizing
                  </span>
                ) : 'Optimize Prompt →'}
              </button>
            </div>
          </div>
        </div>

        {/* Output panel / History */}
        <div className="optimizer-output-panel">
          {showHistory ? (
            <div className="optimizer-history">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>History</div>
                <button className="btn btn-danger btn-sm" onClick={clearHistory}>Clear All</button>
              </div>
              {history.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">⚡</div>
                  <div className="empty-state-title">No history yet</div>
                  <div className="empty-state-body">Optimized prompts will appear here.</div>
                </div>
              ) : (
                <div className="optimizer-history-list">
                  {history.map(entry => (
                    <HistoryItem key={entry.id} entry={entry} onSelect={handleSelectHistory} />
                  ))}
                </div>
              )}
            </div>
          ) : activeResult ? (
            <>
              <div className="section-label">Optimized Output</div>
              <OptimizedResult
                entry={activeResult}
                onClear={() => setActiveResult(null)}
              />
            </>
          ) : (
            <div className="optimizer-placeholder">
              <div className="optimizer-placeholder-icon">⚡</div>
              <div className="optimizer-placeholder-title">Waiting for your prompt</div>
              <div className="optimizer-placeholder-body">
                Enter a raw prompt on the left. Metalayer will apply your current tone
                ({toneDesc}), inject relevant memory, and add formatting instructions.
              </div>
              {history.length > 0 && (
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: 16 }}
                  onClick={() => setShowHistory(true)}
                >
                  View history →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
