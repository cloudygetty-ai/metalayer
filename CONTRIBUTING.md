# Contributing to Metalayer

Thank you for your interest in contributing to Metalayer. This document provides guidelines and instructions for contributing to the project.

---

## Development Setup

1. **Fork and clone:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/metalayer.git
   cd metalayer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local API URL
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

---

## Project Structure

```
src/
├── lib/                 # Core logic (stores, API, utils)
├── components/          # React components (organized by feature)
├── styles/              # Global styles and design tokens
└── hooks/               # Custom React hooks (future)
```

### Component Organization

Each feature has its own directory:
```
components/ToneEngine/
├── ToneEngine.jsx       # Main component
├── ToneEngine.css       # Component styles
└── components/          # Sub-components (if needed)
```

---

## Code Style

### JavaScript/React
- Use functional components with hooks
- Prefer named exports for components
- Use destructuring for props
- Keep components focused and single-responsibility

**Good:**
```jsx
export default function ToneSlider({ label, value, onChange }) {
  return <div className="tone-slider">...</div>
}
```

**Avoid:**
```jsx
export default function Component(props) {
  const { a, b, c, d, e, f } = props  // Too many props
  // 200 lines of code...
}
```

### CSS
- Use CSS custom properties (defined in globals.css)
- Follow BEM-like naming: `component-element-modifier`
- Mobile-first responsive design
- Avoid inline styles unless dynamic

**Good:**
```css
.tone-slider { /* component */ }
.tone-slider-track { /* element */ }
.tone-slider-track.active { /* modifier */ }
```

### State Management
- Use Zustand stores for global state
- Use local `useState` for component-only state
- Persist important state via Zustand persist middleware

---

## Adding a New Feature

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Create component directory:**
   ```bash
   mkdir -p src/components/YourFeature
   touch src/components/YourFeature/YourFeature.{jsx,css}
   ```

3. **Implement component** following existing patterns

4. **Add to navigation** in `AppShell.jsx` if needed

5. **Test locally:**
   ```bash
   npm run dev
   # Test all four engines still work
   # Verify your feature works
   ```

6. **Commit with clear message:**
   ```bash
   git add .
   git commit -m "feat: add YourFeature with X capability"
   ```

7. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Testing Checklist

Before submitting a PR:
- [ ] Code runs without errors (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] All four engines still functional
- [ ] State persists correctly in localStorage
- [ ] Mobile responsive (test at 375px width)
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari

---

## Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Build/tooling changes

**Examples:**
```
feat: add export functionality to Memory Engine
fix: tone slider not updating preview on mobile
docs: update README with deployment instructions
refactor: extract slider component from ToneEngine
```

---

## Pull Request Process

1. **Ensure PR has clear description**
   - What does it do?
   - Why is it needed?
   - How was it tested?

2. **Reference related issues**
   - "Closes #123" or "Fixes #456"

3. **Request review from maintainers**

4. **Address review feedback**
   - Push additional commits to same branch
   - Do NOT force-push after review starts

5. **Squash commits before merge** (optional)

---

## Architecture Decisions

### Why Zustand?
- Minimal boilerplate vs Redux
- Built-in persistence
- Easy cross-store communication
- TypeScript-friendly

### Why Vite?
- Fast HMR during development
- Smaller bundle sizes
- Modern ESM-first approach
- Better DX than CRA

### Why CSS-in-files vs CSS-in-JS?
- Better performance (no runtime cost)
- Easier to theme via CSS variables
- Simpler mental model for designers
- Co-located with components

---

## Adding Dependencies

Before adding a new dependency:
1. Check if functionality can be implemented with existing deps
2. Verify package is actively maintained
3. Check bundle size impact (`npm run build` and compare)
4. Document why it's needed in PR

**Avoid:**
- Lodash (use native JS)
- Moment (use date-fns, already included)
- jQuery (use native DOM APIs)

---

## Performance Guidelines

- **Code splitting**: Lazy load heavy components
- **Bundle size**: Keep vendor chunks under 500KB
- **Re-renders**: Use React.memo for expensive components
- **Storage**: Limit localStorage to <5MB total

---

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for architecture questions
- Check existing issues before creating new ones

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
