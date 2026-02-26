#!/bin/bash

# Metalayer — Git Setup and Push Script
# This script initializes a git repository and pushes to GitHub

echo "════════════════════════════════════════════════════════════"
echo "Metalayer — Git Repository Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Navigate to project directory
cd /home/claude/metalayer

# Initialize git repository
echo "→ Initializing Git repository..."
git init

# Create .gitignore
echo "→ Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.DS_Store

# Testing
coverage/

# Misc
*.log
.cache/
EOF

# Add all files
echo "→ Adding files to Git..."
git add .

# Create initial commit
echo "→ Creating initial commit..."
git commit -m "Initial commit: Metalayer v1.0 - Complete source code

Four core systems implemented:
- Tone Engine (sliders, presets, live preview, custom profiles)
- Memory Engine (CRUD, tags, search, type filters)
- Prompt Optimizer (input → enriched output, history)
- Model Routing (auto/manual modes, custom rules, routing log)

Tech stack:
- React 18.2 + Vite 5.1
- Zustand state management with localStorage persistence
- Modular component architecture
- Complete design system with CSS custom properties

Production-ready frontend — ready to connect to AI API backend."

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Git repository initialized successfully!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to https://github.com/new"
echo "   → Repository name: metalayer"
echo "   → Description: The Intelligence Layer - AI personalization via tone, memory, optimization, and routing"
echo "   → Public or Private: Your choice"
echo "   → Do NOT initialize with README (we already have one)"
echo ""
echo "2. Add GitHub remote and push:"
echo "   Replace YOUR_USERNAME with your GitHub username:"
echo ""
echo "   cd /home/claude/metalayer"
echo "   git remote add origin https://github.com/YOUR_USERNAME/metalayer.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. OR use GitHub CLI if you have it configured:"
echo ""
echo "   gh auth login"
echo "   gh repo create metalayer --public --source=. --remote=origin --push"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Repository ready at: /home/claude/metalayer"
echo "Commit hash: $(git rev-parse --short HEAD)"
echo "Files tracked: $(git ls-files | wc -l)"
echo ""
