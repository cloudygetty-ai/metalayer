/**
 * Metalayer — Tone Engine
 * Full tone calibration UI: sliders, presets, custom profiles, live preview
 */

import React, { useState } from 'react'
import { useToneStore } from '@/lib/store'
import './ToneEngine.css'

// ── SLIDER COMPONENT ──────────────────────────────────────────────────────────

function ToneSlider({ label, valueKey, value, description }) {
  const setSlider = useToneStore(s => s.setSlider)

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
    setSlider(valueKey, pct)
  }

  const getValueLabel = (v) => {
    if (v >= 80) return 'High'
    if (v >= 55) return 'Balanced'
    if (v >= 30) return 'Low'
    return 'Minimal'
  }

  const getAccentColor = (key) => {
    const colors = {
      directness:  'var(--accent-lt)',
      warmth:      'var(--jade)',
      formality:   'var(--sky)',
      conciseness: 'var(--gold)',
    }
    return colors[key] || 'var(--accent-lt)'
  }

  const color = getAccentColor(valueKey)

  return (
    <div className="tone-slider">
      <div className="tone-slider-header">
        <div className="tone-slider-label-wrap">
          <span className="tone-slider-name">{label}</span>
          <span className="tone-slider-desc">{description}</span>
        </div>
        <div className="tone-slider-value" style={{ color }}>
          <span className="tone-slider-num">{value}</span>
          <span className="tone-slider-pct">%</span>
          <span className="tone-slider-tag">{getValueLabel(value)}</span>
        </div>
      </div>

      <div className="tone-slider-track-wrap" onClick={handleTrackClick}>
        <div className="tone-slider-track">
          <div
            className="tone-slider-fill"
            style={{ width: `${value}%`, background: color }}
          />
          <div
            className="tone-slider-thumb"
            style={{ left: `${value}%`, boxShadow: `0 0 8px ${color}66` }}
          />
        </div>
        <div className="tone-slider-ticks">
          {[0, 25, 50, 75, 100].map(tick => (
            <span
              key={tick}
              className={`tone-slider-tick ${value >= tick ? 'active' : ''}`}
              style={value >= tick ? { color } : {}}
            />
          ))}
        </div>
      </div>

      <div className="tone-slider-poles">
        <span>{label === 'Warmth' ? 'Cold' : label === 'Formality' ? 'Casual' : 'Low'}</span>
        <span>{label === 'Warmth' ? 'Warm' : label === 'Formality' ? 'Formal' : 'High'}</span>
      </div>
    </div>
  )
}

// ── PRESET CARD ───────────────────────────────────────────────────────────────

function PresetCard({ id, preset, isActive, onApply }) {
  return (
    <button
      className={`tone-preset ${isActive ? 'active' : ''}`}
      onClick={() => onApply(id)}
    >
      <div className="tone-preset-name">{preset.name}</div>
      <div className="tone-preset-desc">{preset.description}</div>
      <div className="tone-preset-bars">
        {['directness', 'warmth', 'formality', 'conciseness'].map(key => (
          <div key={key} className="tone-preset-bar-wrap">
            <div
              className="tone-preset-bar-fill"
              style={{ width: `${preset[key]}%` }}
            />
          </div>
        ))}
      </div>
    </button>
  )
}

// ── LIVE PREVIEW ──────────────────────────────────────────────────────────────

function LivePreview({ directness, warmth, formality, conciseness }) {
  const getPreviewText = () => {
    // Generate a contextual sample based on the current slider combination
    if (directness > 75 && formality > 75 && conciseness > 75)
      return 'Deliver the Q3 report by Thursday at 9 AM. Include financial highlights and forward guidance only. No appendices.'
    if (directness > 75 && warmth < 40)
      return 'The deadline is Thursday. Send the completed draft to the team. No extensions.'
    if (warmth > 75 && formality < 40)
      return "Hey! When you get a chance, would you mind sending over the Q3 report? No rush — just whenever works best for you."
    if (warmth > 60 && directness > 60)
      return "Hi Sarah — could you get the Q3 report to me by Thursday? Let me know if you need anything from my end to make that happen."
    if (formality > 75 && warmth < 50)
      return "Please submit the Q3 performance report prior to Thursday's executive review. Ensure all financial metrics are verified."
    if (conciseness < 35)
      return 'I wanted to follow up regarding the quarterly performance report for Q3 that we had discussed in our previous meeting. If it would be possible, I would greatly appreciate receiving the completed version ahead of the Thursday review session.'
    return 'The Q3 report should be ready by Thursday. Let me know if anything needs alignment before then.'
  }

  const descriptors = []
  if (directness > 70) descriptors.push({ label: 'Direct', color: 'var(--accent-lt)' })
  if (warmth > 65)     descriptors.push({ label: 'Warm',   color: 'var(--jade)' })
  if (formality > 70)  descriptors.push({ label: 'Formal', color: 'var(--sky)' })
  if (conciseness > 70) descriptors.push({ label: 'Concise', color: 'var(--gold)' })
  if (descriptors.length === 0) descriptors.push({ label: 'Balanced', color: 'var(--sub)' })

  return (
    <div className="tone-preview">
      <div className="tone-preview-header">
        <span className="tone-preview-title">Live Preview</span>
        <div className="tone-preview-tags">
          {descriptors.map(d => (
            <span key={d.label} className="tone-preview-tag" style={{ color: d.color, borderColor: `${d.color}40` }}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
      <div className="tone-preview-text">
        "{getPreviewText()}"
      </div>
      <div className="tone-preview-hint">
        Preview updates in real time as you adjust the sliders above.
      </div>
    </div>
  )
}

// ── CUSTOM PROFILE MODAL ──────────────────────────────────────────────────────

function SaveProfileModal({ onSave, onClose }) {
  const [name, setName] = useState('')
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Save Tone Profile</h3>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="input-wrap">
            <label className="input-label">Profile Name</label>
            <input
              className="input"
              placeholder="e.g. Executive Draft, Client Emails…"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => onSave(name.trim())}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN TONE ENGINE ──────────────────────────────────────────────────────────

export default function ToneEngine() {
  const {
    directness, warmth, formality, conciseness,
    activePreset, customProfiles,
    applyPreset, saveCustomProfile, deleteCustomProfile, loadCustomProfile,
    getPresets, getToneDescriptor,
  } = useToneStore()

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [savedMsg,      setSavedMsg]      = useState(null)

  const presets = getPresets()

  const sliders = [
    { label: 'Directness',  valueKey: 'directness',  value: directness,  description: 'How assertive and to-the-point the AI sounds' },
    { label: 'Warmth',      valueKey: 'warmth',      value: warmth,      description: 'Degree of personal connection and approachability' },
    { label: 'Formality',   valueKey: 'formality',   value: formality,   description: 'Professional register vs. conversational tone' },
    { label: 'Conciseness', valueKey: 'conciseness', value: conciseness, description: 'Brevity of output — short and sharp vs. detailed' },
  ]

  const handleSave = (name) => {
    saveCustomProfile(name)
    setShowSaveModal(false)
    setSavedMsg(`"${name}" saved.`)
    setTimeout(() => setSavedMsg(null), 2800)
  }

  return (
    <div className="tone-engine animate-fade-up">
      {showSaveModal && (
        <SaveProfileModal
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="tone-engine-header">
        <div>
          <h2 className="tone-engine-title">Tone Engine</h2>
          <p className="tone-engine-sub">
            Calibrate your AI voice once. Applied across every model, every integration, every output.
          </p>
        </div>
        <div className="tone-engine-actions">
          {savedMsg && (
            <span className="tone-saved-msg">{savedMsg}</span>
          )}
          <button className="btn btn-ghost" onClick={() => applyPreset('neutral')}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={() => setShowSaveModal(true)}>
            Save Profile
          </button>
        </div>
      </div>

      {/* ── CURRENT TONE DESCRIPTOR ── */}
      <div className="tone-descriptor">
        <span className="tone-descriptor-label">Active tone:</span>
        <span className="tone-descriptor-value">{getToneDescriptor()}</span>
        {activePreset !== 'custom' && (
          <span className="badge badge-accent" style={{ marginLeft: 8 }}>
            {presets[activePreset]?.name}
          </span>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="tone-engine-grid">
        {/* LEFT: Sliders */}
        <div className="tone-sliders-panel">
          <div className="section-label">Calibrate</div>
          <div className="tone-sliders-list">
            {sliders.map(s => (
              <ToneSlider key={s.valueKey} {...s} />
            ))}
          </div>
        </div>

        {/* RIGHT: Preview + Presets */}
        <div className="tone-right-panel">
          <LivePreview
            directness={directness}
            warmth={warmth}
            formality={formality}
            conciseness={conciseness}
          />

          {/* Presets */}
          <div className="section-label" style={{ marginTop: 24 }}>Presets</div>
          <div className="tone-presets-grid">
            {Object.entries(presets).map(([id, preset]) => (
              <PresetCard
                key={id}
                id={id}
                preset={preset}
                isActive={activePreset === id}
                onApply={applyPreset}
              />
            ))}
          </div>

          {/* Custom Profiles */}
          {customProfiles.length > 0 && (
            <>
              <div className="section-label" style={{ marginTop: 20 }}>Saved Profiles</div>
              <div className="tone-custom-profiles">
                {customProfiles.map(profile => (
                  <div key={profile.id} className="tone-custom-profile">
                    <div className="tone-custom-profile-info">
                      <span className="tone-custom-profile-name">{profile.name}</span>
                      <span className="tone-custom-profile-date">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="tone-custom-profile-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => loadCustomProfile(profile)}
                      >
                        Apply
                      </button>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => deleteCustomProfile(profile.id)}
                        title="Delete profile"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
