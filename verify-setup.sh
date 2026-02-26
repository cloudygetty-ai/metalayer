#!/bin/bash

# Metalayer — Setup Verification & Troubleshooting Script
# Run this to diagnose and fix common issues

echo "════════════════════════════════════════════════════════════"
echo "Metalayer — Setup Verification"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check Node.js version
echo "→ Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed"
    echo "  Install from: https://nodejs.org (requires v18 or higher)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "✗ Node.js version too old: $(node -v)"
    echo "  Metalayer requires Node.js v18 or higher"
    echo "  Install from: https://nodejs.org"
    exit 1
fi
echo "✓ Node.js $(node -v) — OK"

# Check npm
echo "→ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm is not installed"
    exit 1
fi
echo "✓ npm $(npm -v) — OK"

echo ""
echo "→ Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "✗ npm install failed"
    echo ""
    echo "Common fixes:"
    echo "  1. Delete node_modules and package-lock.json:"
    echo "     rm -rf node_modules package-lock.json"
    echo "     npm install"
    echo ""
    echo "  2. Clear npm cache:"
    echo "     npm cache clean --force"
    echo "     npm install"
    echo ""
    echo "  3. Use yarn instead:"
    echo "     npm install -g yarn"
    echo "     yarn install"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Verify critical files
echo "→ Verifying project structure..."
REQUIRED_FILES=(
    "package.json"
    "vite.config.js"
    "index.html"
    "src/main.jsx"
    "src/App.jsx"
    "src/lib/store.js"
    "src/components/ToneEngine/ToneEngine.jsx"
    "src/components/MemoryEngine/MemoryEngine.jsx"
    "src/components/PromptOptimizer/PromptOptimizer.jsx"
    "src/components/ModelRouting/ModelRouting.jsx"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "✗ Missing: $file"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "✗ Some files are missing"
    echo "  Re-clone the repository:"
    echo "  git clone https://github.com/cloudygetty-ai/metalayer.git"
    exit 1
fi

echo "✓ All required files present"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✓ Setup verification complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Ready to run:"
echo "  npm run dev    # Start development server"
echo "  npm run build  # Build for production"
echo ""
echo "The app will open at: http://localhost:3000"
echo ""
