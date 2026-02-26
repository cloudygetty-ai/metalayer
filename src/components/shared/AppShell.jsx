/**
 * Metalayer — App Shell
 * Sidebar navigation + main content area
 */

import React, { useState } from 'react'
import './AppShell.css'

const NAV_ITEMS = [
  { id: 'tone',      label: 'Tone Engine',      icon: '🎚', color: 'var(--accent-lt)', description: 'Calibrate your voice' },
  { id: 'memory',    label: 'Memory Engine',     icon: '🧠', color: 'var(--jade)',      description: 'Persistent context layer' },
  { id: 'optimizer', label: 'Prompt Optimizer',  icon: '⚡', color: 'var(--gold)',      description: 'Optimize before sending' },
  { id: 'routing',   label: 'Model Routing',     icon: '⇌', color: 'var(--sky)',       description: 'Route to optimal model' },
]

function NavItem({ item, isActive, onClick }) {
  return (
    <button
      className={`shell-nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={isActive ? { borderColor: `${item.color}35`, color: item.color } : {}}
    >
      <div
        className="shell-nav-icon"
        style={isActive ? { background: `${item.color}14`, border: `1px solid ${item.color}25` } : {}}
      >
        {item.icon}
      </div>
      <div className="shell-nav-text">
        <span className="shell-nav-label">{item.label}</span>
        <span className="shell-nav-desc">{item.description}</span>
      </div>
      {isActive && <div className="shell-nav-active-bar" style={{ background: item.color }} />}
    </button>
  )
}

export default function AppShell({ children, activePage, onNavigate }) {
  const activeItem = NAV_ITEMS.find(n => n.id === activePage)

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="shell-sidebar">
        {/* Logo */}
        <div className="shell-logo">
          <div className="shell-logo-mark">Metalayer</div>
          <div className="shell-logo-tag">Intelligence Layer</div>
        </div>

        {/* Nav */}
        <nav className="shell-nav">
          <div className="shell-nav-label-group">Systems</div>
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activePage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        {/* Status bar */}
        <div className="shell-status">
          <div className="shell-status-dot" />
          <span className="shell-status-text">Intelligence layer active</span>
        </div>

        {/* Footer */}
        <div className="shell-footer">
          <div className="shell-footer-line">
            <span className="shell-footer-label">v1.0.0</span>
            <span className="shell-footer-sep">·</span>
            <span className="shell-footer-label">Production</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="shell-main">
        {/* Top bar */}
        <header className="shell-topbar">
          <div className="shell-topbar-left">
            {activeItem && (
              <>
                <span className="shell-topbar-icon">{activeItem.icon}</span>
                <div>
                  <div className="shell-topbar-title">{activeItem.label}</div>
                </div>
              </>
            )}
          </div>
          <div className="shell-topbar-right">
            <div className="shell-topbar-badge">
              <span className="shell-topbar-badge-dot" />
              All systems active
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="shell-content">
          {children}
        </main>
      </div>
    </div>
  )
}
