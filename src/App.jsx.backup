/**
 * Metalayer — App Entry Point
 * Root component: wires AppShell to all four engine pages
 */

import React, { useState } from 'react'
import AppShell    from '@/components/shared/AppShell'
import ToneEngine  from '@/components/ToneEngine/ToneEngine'
import MemoryEngine from '@/components/MemoryEngine/MemoryEngine'
import PromptOptimizer from '@/components/PromptOptimizer/PromptOptimizer'
import ModelRouting from '@/components/ModelRouting/ModelRouting'

import '@/styles/globals.css'
import '@/styles/components.css'
import '@/components/shared/AppShell.css'
import '@/components/ToneEngine/ToneEngine.css'
import '@/components/MemoryEngine/MemoryEngine.css'
import '@/components/PromptOptimizer/PromptOptimizer.css'
import '@/components/ModelRouting/ModelRouting.css'

const PAGES = {
  tone:      ToneEngine,
  memory:    MemoryEngine,
  optimizer: PromptOptimizer,
  routing:   ModelRouting,
}

export default function App() {
  const [activePage, setActivePage] = useState('tone')
  const Page = PAGES[activePage] || ToneEngine

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      <Page key={activePage} />
    </AppShell>
  )
}
