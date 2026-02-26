# Metalayer — Source Code

**The Intelligence Layer.** A production-ready React frontend implementing all four core Metalayer systems: Tone Engine, Memory Engine, Prompt Optimizer, and Model Routing.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → Opens at http://localhost:3000

# 3. Build for production
npm run build
```

---

## Project Structure

```
metalayer/
├── index.html                          # HTML entry point
├── vite.config.js                      # Vite configuration
├── package.json                        # Dependencies
└── src/
    ├── main.jsx                        # React root mount
    ├── App.jsx                         # Root component + page router
    │
    ├── lib/
    │   └── store.js                    # Zustand state — all four engines
    │
    ├── styles/
    │   ├── globals.css                 # Design tokens, reset, typography
    │   └── components.css              # Button, Card, Badge, Input, Modal…
    │
    └── components/
        ├── shared/
        │   ├── AppShell.jsx            # Sidebar + topbar layout
        │   └── AppShell.css
        │
        ├── ToneEngine/
        │   ├── ToneEngine.jsx          # Sliders, presets, live preview
        │   └── ToneEngine.css
        │
        ├── MemoryEngine/
        │   ├── MemoryEngine.jsx        # CRUD, tags, search, filters
        │   └── MemoryEngine.css
        │
        ├── PromptOptimizer/
        │   ├── PromptOptimizer.jsx     # Input → optimized output + history
        │   └── PromptOptimizer.css
        │
        └── ModelRouting/
            ├── ModelRouting.jsx        # Model cards, rules CRUD, routing log
            └── ModelRouting.css
```

---

## Core Systems

### Tone Engine (`src/components/ToneEngine/`)
Four interactive sliders: Directness, Warmth, Formality, Conciseness. Five built-in presets (Executive, Creative, Technical, Supportive, Neutral). Live preview panel updates in real time. Custom profiles saved to localStorage via Zustand persist.

### Memory Engine (`src/components/MemoryEngine/`)
Full CRUD for six memory types: Project, Preference, Constraint, Style, Context, Persona. Tag system with add/remove. Real-time search and type filter. Retrieval count tracking. Empty and loading states included.

### Prompt Optimizer (`src/components/PromptOptimizer/`)
Raw text input with keyboard shortcut (⌘+Enter). Optimizer applies current tone descriptor, retrieves relevant memory items by keyword matching, adds format instructions based on detected task type, and routes to the optimal model. Displays result with annotated injection sections, character count delta, and copy-to-clipboard. History panel with up to 50 entries.

### Model Routing (`src/components/ModelRouting/`)
Five pre-configured models (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, Claude Haiku, GPT-4o Mini). Auto mode detects task type from prompt keywords. Manual mode uses the default model. Custom keyword rules with priority ordering. Full routing decision log.

---

## State Architecture

All state lives in `src/lib/store.js` as four independent Zustand stores, each persisted to localStorage:

| Store | Key | Contents |
|---|---|---|
| `useToneStore` | `metalayer-tone` | Slider values, active preset, custom profiles |
| `useMemoryStore` | `metalayer-memory` | Memory items, search state, filters |
| `useOptimizerStore` | `metalayer-optimizer` | Optimization history |
| `useRoutingStore` | `metalayer-routing` | Mode, rules, routing log |

All stores are cross-connected: the optimizer reads from tone and memory stores before generating output, and routing decisions log through the routing store.

---

## Connecting to a Real AI API

The optimizer currently runs client-side simulation. To connect to a real API, replace the `optimizePrompt` function body in `src/lib/store.js`:

```js
// Replace the simulation block with a real API call:
const response = await fetch('/api/optimize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: rawPrompt,
    tone:   { directness, warmth, formality, conciseness },
    memory: relevantMem,
    model:  routingModel,
  }),
})
const data = await response.json()
```

---

## Design System

All design tokens are CSS custom properties in `src/styles/globals.css`. The token set covers backgrounds (7 levels), accent colors (6 semantic colors + dark variants), typography (EB Garamond display + Rubik body), spacing (s-1 through s-7), border radii, shadows, and transitions.

Font stack: **EB Garamond** (display, via Google Fonts) + **Rubik** (body, via Google Fonts).

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI Framework | React | 18.2 |
| State Management | Zustand | 4.5 |
| Build Tool | Vite | 5.1 |
| Routing | React Router DOM | 6.22 |
| Persistence | Zustand persist middleware | — |
| Utilities | clsx, date-fns | — |

---

## License

MIT. Built for Metalayer v1.0.
