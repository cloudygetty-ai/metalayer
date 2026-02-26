/**
 * Metalayer — Pricing Page
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './Marketing.css'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '3 tone profiles',
      '10 memory items',
      '50 optimizations/month',
      'Basic routing',
      'Community support',
    ],
    cta: 'Start free',
    href: '/sign-up',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    features: [
      'Unlimited tone profiles',
      '100 memory items',
      'Unlimited optimizations',
      'Advanced routing rules',
      'Priority support',
      'Export/import data',
    ],
    cta: 'Start Pro trial',
    href: '/sign-up?plan=pro',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Pro',
      '5 team members',
      'Shared memory & tone',
      'Team analytics',
      'Admin dashboard',
      'SSO support',
    ],
    cta: 'Start Team trial',
    href: '/sign-up?plan=team',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="pricing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-text">Metalayer</span>
          </Link>
          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link">Home</Link>
            <Link to="/sign-in" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/sign-up" className="btn btn-primary btn-sm">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="pricing-hero">
        <h1 className="pricing-title">Simple, transparent pricing</h1>
        <p className="pricing-sub">Start free. Upgrade when you're ready. Cancel anytime.</p>
      </section>

      <section className="pricing-plans">
        {PLANS.map(plan => (
          <div key={plan.name} className={`pricing-plan ${plan.highlight ? 'pricing-plan-highlight' : ''}`}>
            {plan.highlight && <div className="pricing-plan-badge">Most Popular</div>}
            <h3 className="pricing-plan-name">{plan.name}</h3>
            <div className="pricing-plan-price">
              <span className="pricing-plan-amount">{plan.price}</span>
              <span className="pricing-plan-period">{plan.period}</span>
            </div>
            <ul className="pricing-plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <Link to={plan.href} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} w-full`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-logo-text">Metalayer</span>
          </div>
          <div className="landing-footer-links">
            <Link to="/">Home</Link>
            <Link to="/sign-in">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
