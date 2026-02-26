# Metalayer — Phase 2 Roadmap

## Building: Authentication → Backend → Marketing → Monetization

**Current Status:** Core product built and deployed-ready  
**Next Phase:** Production SaaS platform

---

## Phase 2.1 — Authentication System
**Time:** 1 hour  
**Stack:** Clerk (recommended) or Supabase Auth

### Features:
- User signup/login (email + OAuth)
- Protected routes
- User profile management
- Session management
- Password reset flow

### Implementation:
- Install Clerk/Supabase SDK
- Add auth provider wrapper
- Create login/signup pages
- Protect app routes
- Add user context to all stores
- Migrate localStorage → user-specific database storage

---

## Phase 2.2 — Real AI Backend
**Time:** 2 hours  
**Stack:** Node.js + Express + PostgreSQL

### Features:
- REST API with authentication
- Claude API integration
- OpenAI API integration
- Gemini API integration
- API key management
- Request logging
- Rate limiting
- Caching layer

### Endpoints:
```
POST /api/optimize
POST /api/memory
GET  /api/memory
DELETE /api/memory/:id
POST /api/routing
GET  /api/models
POST /api/tone
GET  /api/user/stats
```

### Database Schema:
- users (id, email, created_at, plan)
- tone_profiles (user_id, settings, name)
- memory_items (user_id, type, content, tags)
- prompts (user_id, raw, optimized, timestamp)
- routing_decisions (user_id, model_id, prompt_id)
- api_keys (user_id, provider, key_encrypted)

---

## Phase 2.3 — Marketing Site
**Time:** 2 hours

### Pages:
1. **Landing Page**
   - Hero with live demo
   - Feature showcase (4 systems)
   - Social proof
   - CTA to signup

2. **Pricing Page**
   - Free tier (limited)
   - Pro tier ($12/mo)
   - Team tier ($49/mo)
   - Enterprise (custom)

3. **Documentation**
   - Quick start guide
   - Tone Engine docs
   - Memory Engine docs
   - Prompt Optimizer docs
   - Model Routing docs
   - API reference

4. **Blog**
   - "Why AI Needs Memory"
   - "Tone is Identity"
   - "The Cost of Context Switching"
   - Use cases & tutorials

---

## Phase 2.4 — Monetization
**Time:** 2 hours  
**Stack:** Stripe + webhooks

### Subscription Tiers:

**Free:**
- 3 tone profiles
- 10 memory items
- 50 optimizations/month
- Basic routing
- Community support

**Pro ($12/mo):**
- Unlimited tone profiles
- 100 memory items
- Unlimited optimizations
- Advanced routing rules
- Priority support
- Export/import data

**Team ($49/mo):**
- Everything in Pro
- 5 team members
- Shared memory & tone
- Team analytics
- Admin dashboard
- SSO

**Enterprise (custom):**
- Unlimited everything
- On-premise deployment
- Custom integrations
- Dedicated support
- SLA

### Implementation:
- Stripe integration
- Subscription management
- Usage tracking
- Plan limits enforcement
- Payment webhooks
- Billing portal
- Invoice generation

---

## Timeline:

**Week 1:** Authentication + Backend  
**Week 2:** Marketing Site + Monetization  
**Week 3:** Testing + Launch  

**Target:** Production SaaS in 3 weeks

