/**
 * Metalayer — Landing Page
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './Marketing.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <span className="landing-logo-text">Metalayer</span>
            <span className="landing-logo-tag">Intelligence Layer</span>
          </div>
          <div className="landing-nav-links">
            <Link to="/pricing" className="landing-nav-link">Pricing</Link>
            <Link to="/sign-in" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/sign-up" className="btn btn-primary btn-sm">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Now in production
          </div>
          <h1 className="landing-hero-title">
            Your AI, <em>upgraded</em>
          </h1>
          <p className="landing-hero-sub">
            Add tone, memory, and context to every AI model you use.
            <br />
            The intelligence layer that makes AI personal.
          </p>
          <div className="landing-hero-cta">
            <Link to="/sign-up" className="btn btn-primary btn-lg">
              Start free →
            </Link>
            <Link to="/pricing" className="btn btn-ghost btn-lg">
              View pricing
            </Link>
          </div>
          <p className="landing-hero-note">
            No credit card required • Free tier available • Deploy in minutes
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="landing-section-header">
          <span className="landing-section-label">Four Core Systems</span>
          <h2 className="landing-section-title">
            Intelligence that <em>learns</em>
          </h2>
        </div>

        <div className="landing-features-grid">
          {[
            {
              icon: '🎚',
              title: 'Tone Engine',
              desc: 'Calibrate your voice using sliders and presets. Applied across all platforms automatically.',
              features: ['4 calibration sliders', '5 built-in presets', 'Live preview', 'Custom profiles'],
            },
            {
              icon: '🧠',
              title: 'Memory Engine',
              desc: 'Private semantic memory across projects and patterns. Persistent, encrypted, user-owned.',
              features: ['6 memory types', 'Tag system', 'Semantic search', 'Auto-retrieval'],
            },
            {
              icon: '⚡',
              title: 'Prompt Optimizer',
              desc: 'Rewrites prompts for structure and precision before they reach any model.',
              features: ['Structural analysis', 'Tone application', 'Context injection', 'Format detection'],
            },
            {
              icon: '⇌',
              title: 'Model Routing',
              desc: 'Routes tasks to the optimal AI model via automatic detection or custom rules.',
              features: ['5 pre-configured models', 'Auto/manual modes', 'Custom keyword rules', 'Decision logging'],
            },
          ].map((feature, i) => (
            <div key={i} className="landing-feature-card">
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-desc">{feature.desc}</p>
              <ul className="landing-feature-list">
                {feature.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2 className="landing-cta-title">Ready to upgrade your AI?</h2>
        <p className="landing-cta-sub">Start free. No credit card required.</p>
        <Link to="/sign-up" className="btn btn-primary btn-lg">
          Get started →
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-logo-text">Metalayer</span>
            <p className="landing-footer-tagline">The Intelligence Layer</p>
          </div>
          <div className="landing-footer-links">
            <Link to="/pricing">Pricing</Link>
            <Link to="/sign-in">Sign in</Link>
            <Link to="/sign-up">Sign up</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>© 2026 Metalayer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
