# Push Metalayer to GitHub — Complete Guide

Git repository is initialized and ready. All 30 files committed to `main` branch.

---

## Option 1: Using GitHub Web Interface (Recommended)

### Step 1: Create Repository on GitHub
1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name:** `metalayer`
   - **Description:** `The Intelligence Layer — AI personalization via tone, memory, optimization, and routing`
   - **Visibility:** Public or Private (your choice)
   - **⚠️ IMPORTANT:** Do NOT check "Initialize with README" — we already have one
3. Click **Create repository**

### Step 2: Push from Terminal
GitHub will show you commands. Use these:

```bash
cd /home/claude/metalayer
git remote add origin https://github.com/YOUR_USERNAME/metalayer.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### Step 3: Enter Credentials
When prompted:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your password)
  - Generate at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)
  - Copy the token and paste when prompted for password

---

## Option 2: Using GitHub CLI (If Installed)

If you have GitHub CLI (`gh`) installed and authenticated:

```bash
cd /home/claude/metalayer
gh auth login
gh repo create metalayer --public --source=. --remote=origin --push
```

This will:
- Create the repository on GitHub
- Add it as remote origin
- Push all code automatically

---

## Option 3: Using SSH (If You Have SSH Keys Set Up)

```bash
cd /home/claude/metalayer
git remote add origin git@github.com:YOUR_USERNAME/metalayer.git
git push -u origin main
```

---

## What Gets Pushed

All 30 files in your repository:

**Core Application:**
- `package.json` — Dependencies
- `vite.config.js` — Build config
- `index.html` — Entry point
- `README.md` — Full documentation

**Source Code:**
- `src/App.jsx` — Root component
- `src/main.jsx` — React mount
- `src/lib/store.js` — Zustand state (4 engines)

**Components (All Four Systems):**
- `src/components/ToneEngine/` — Sliders, presets, preview
- `src/components/MemoryEngine/` — CRUD, tags, search
- `src/components/PromptOptimizer/` — Input → output, history
- `src/components/ModelRouting/` — Models, rules, routing log
- `src/components/shared/AppShell` — Sidebar layout

**Styles:**
- `src/styles/globals.css` — Design tokens
- `src/styles/components.css` — UI components

**Configuration:**
- `.gitignore` — Excludes node_modules, dist, .env
- Plus additional config files

---

## After Pushing

Your repository URL will be:
```
https://github.com/YOUR_USERNAME/metalayer
```

Anyone can then clone and run it:
```bash
git clone https://github.com/YOUR_USERNAME/metalayer.git
cd metalayer
npm install
npm run dev
```

---

## Troubleshooting

### "Authentication failed"
→ Use a Personal Access Token instead of your password
→ Generate at: https://github.com/settings/tokens

### "Repository already exists"
→ Delete the existing repo on GitHub first, or use a different name

### "Permission denied (publickey)"
→ You need to set up SSH keys or use HTTPS with token instead

---

## Current Repository Status

```
Commit:  2f91c36
Branch:  main
Files:   30 tracked
Status:  Ready to push
```

Run `git status` to verify everything is committed.
Run `git log --oneline` to see commit history.

---

**You're ready to push. Choose an option above and follow the steps.**
