/**
 * Metalayer — Memory Engine
 * Full memory management: add/edit/delete items, tag system, search, type filters
 */

import React, { useState } from 'react'
import { useMemoryStore } from '@/lib/store'
import './MemoryEngine.css'

const TYPE_META = {
  project:    { label: 'Project',    icon: '📁', color: 'var(--accent-lt)' },
  preference: { label: 'Preference', icon: '🎯', color: 'var(--jade)' },
  constraint: { label: 'Constraint', icon: '🚫', color: 'var(--rose)' },
  style:      { label: 'Style',      icon: '✍',  color: 'var(--gold)' },
  context:    { label: 'Context',    icon: '◈',  color: 'var(--sky)' },
  persona:    { label: 'Persona',    icon: '👤', color: 'var(--amber)' },
}

// ── ADD / EDIT FORM ───────────────────────────────────────────────────────────

function MemoryForm({ editItem, onClose }) {
  const { addItem, updateItem, getTypes } = useMemoryStore()
  const [type,    setType]    = useState(editItem?.type    || 'preference')
  const [content, setContent] = useState(editItem?.content || '')
  const [tagInput, setTagInput] = useState('')
  const [tags,    setTags]    = useState(editItem?.tags    || [])
  const [error,   setError]   = useState('')

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t])
    }
    setTagInput('')
  }

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag))

  const handleSubmit = () => {
    if (!content.trim()) { setError('Memory content is required.'); return }
    if (editItem) {
      updateItem(editItem.id, { type, content: content.trim(), tags })
    } else {
      addItem({ type, content: content.trim(), tags })
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal memory-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{editItem ? 'Edit Memory' : 'Add Memory'}</h3>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Type selector */}
          <div style={{ marginBottom: 16 }}>
            <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Type</label>
            <div className="memory-type-selector">
              {getTypes().map(t => {
                const meta = TYPE_META[t]
                return (
                  <button
                    key={t}
                    className={`memory-type-btn ${type === t ? 'active' : ''}`}
                    onClick={() => setType(t)}
                    style={type === t ? { borderColor: meta.color, color: meta.color } : {}}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="input-wrap" style={{ marginBottom: 14 }}>
            <label className="input-label">Content</label>
            <textarea
              className={`input textarea ${error ? 'input-error' : ''}`}
              placeholder={
                type === 'project'    ? 'e.g. Q4 Brand Campaign — deadline Nov 28, executive tone required' :
                type === 'preference' ? 'e.g. Always write in active voice. Avoid bullet points in long-form.' :
                type === 'constraint' ? 'e.g. Never reference competitor pricing in external communications.' :
                type === 'style'      ? 'e.g. Short, punchy sentences. No passive voice. Maximum 3-sentence paragraphs.' :
                type === 'context'    ? 'e.g. Primary stakeholder: Sarah Chen (VP Marketing) — prefers brevity.' :
                'e.g. Senior software engineer. Prefers technical depth over simplified explanations.'
              }
              value={content}
              onChange={e => { setContent(e.target.value); setError('') }}
              rows={3}
            />
            {error && <span className="input-hint" style={{ color: 'var(--rose)' }}>{error}</span>}
          </div>

          {/* Tags */}
          <div className="input-wrap">
            <label className="input-label">Tags</label>
            <div className="memory-tag-input-row">
              <input
                className="input"
                placeholder="Add a tag…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              />
              <button className="btn btn-secondary" onClick={addTag}>Add</button>
            </div>
            {tags.length > 0 && (
              <div className="memory-tags-row" style={{ marginTop: 8 }}>
                {tags.map(tag => (
                  <div key={tag} className="tag tag-removable">
                    {tag}
                    <button className="tag-remove-btn" onClick={() => removeTag(tag)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editItem ? 'Save Changes' : 'Add to Memory'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MEMORY ITEM CARD ──────────────────────────────────────────────────────────

function MemoryItem({ item, onEdit, onDelete }) {
  const meta = TYPE_META[item.type] || TYPE_META.context
  const age  = getRelativeTime(item.createdAt)

  return (
    <div className="memory-item card card-hover">
      <div className="memory-item-left">
        <div
          className="memory-item-icon"
          style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30`, color: meta.color }}
        >
          {meta.icon}
        </div>
      </div>
      <div className="memory-item-body">
        <div className="memory-item-header">
          <span
            className="badge"
            style={{ background: `${meta.color}12`, borderColor: `${meta.color}28`, color: meta.color }}
          >
            {meta.label}
          </span>
          {item.retrievalCount > 0 && (
            <span className="memory-retrieval-count">
              Retrieved {item.retrievalCount}×
            </span>
          )}
        </div>
        <div className="memory-item-content">{item.content}</div>
        <div className="memory-item-footer">
          <div className="memory-item-tags">
            {item.tags.map(t => (
              <span key={t} className="tag" style={{ fontSize: 11, padding: '2px 8px' }}>#{t}</span>
            ))}
          </div>
          <span className="memory-item-age">{age}</span>
        </div>
      </div>
      <div className="memory-item-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(item)}>Edit</button>
        <button className="btn btn-danger btn-sm btn-icon" onClick={() => onDelete(item.id)}>✕</button>
      </div>
    </div>
  )
}

function getRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'Just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  < 7)  return `${days}d ago`
  return new Date(isoString).toLocaleDateString()
}

// ── STATS BAR ─────────────────────────────────────────────────────────────────

function MemoryStats() {
  const { getStats } = useMemoryStore()
  const stats = getStats()
  return (
    <div className="memory-stats-bar">
      <div className="memory-stat">
        <span className="memory-stat-val">{stats.total}</span>
        <span className="memory-stat-key">Total Items</span>
      </div>
      {Object.entries(TYPE_META).map(([type, meta]) => {
        const count = stats.byType[type] || 0
        if (count === 0) return null
        return (
          <div key={type} className="memory-stat">
            <span className="memory-stat-val" style={{ color: meta.color }}>{count}</span>
            <span className="memory-stat-key">{meta.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── MAIN MEMORY ENGINE ────────────────────────────────────────────────────────

export default function MemoryEngine() {
  const {
    searchQuery, activeFilter,
    setSearchQuery, setActiveFilter,
    getFilteredItems, deleteItem,
  } = useMemoryStore()

  const [showForm,  setShowForm]  = useState(false)
  const [editItem,  setEditItem]  = useState(null)

  const filtered = getFilteredItems()

  const openAdd  = () => { setEditItem(null); setShowForm(true) }
  const openEdit = (item) => { setEditItem(item); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditItem(null) }

  return (
    <div className="memory-engine animate-fade-up">
      {showForm && <MemoryForm editItem={editItem} onClose={closeForm} />}

      {/* Header */}
      <div className="memory-engine-header">
        <div>
          <h2 className="memory-engine-title">Memory Engine</h2>
          <p className="memory-engine-sub">
            Your persistent context layer. Add projects, preferences, constraints, and patterns —
            retrieved automatically in every AI interaction.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Memory
        </button>
      </div>

      {/* Stats */}
      <MemoryStats />

      {/* Search + Filter bar */}
      <div className="memory-controls">
        <div className="memory-search-wrap">
          <input
            className="input"
            placeholder="Search memory…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="memory-filter-tabs">
          {['all', ...Object.keys(TYPE_META)].map(f => {
            const meta = TYPE_META[f]
            return (
              <button
                key={f}
                className={`memory-filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
                style={activeFilter === f && meta ? { borderColor: meta.color, color: meta.color } : {}}
              >
                {meta ? `${meta.icon} ${meta.label}` : 'All'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-state-icon">🧠</div>
          <div className="empty-state-title">
            {searchQuery ? 'No matching memories' : 'Memory is empty'}
          </div>
          <div className="empty-state-body">
            {searchQuery
              ? 'Try a different search term or clear the filter.'
              : 'Add your first memory item — a project, preference, or constraint — and Metalayer will retrieve it automatically.'}
          </div>
          {!searchQuery && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>
              Add Memory
            </button>
          )}
        </div>
      ) : (
        <div className="memory-list">
          {filtered.map(item => (
            <MemoryItem
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
