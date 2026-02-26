#!/bin/bash

# Metalayer — Automated GitHub Push Script
# Run this script after entering your GitHub username

echo "════════════════════════════════════════════════════════════"
echo "Metalayer — GitHub Push"
echo "════════════════════════════════════════════════════════════"
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "Error: GitHub username is required"
    exit 1
fi

echo ""
echo "→ Setting up remote for: https://github.com/$GITHUB_USER/metalayer"
echo ""

# Add remote
cd /mnt/user-data/outputs/metalayer-repo
git remote add origin https://github.com/$GITHUB_USER/metalayer.git 2>/dev/null || \
    git remote set-url origin https://github.com/$GITHUB_USER/metalayer.git

echo "→ Remote configured"
echo "→ Pushing to GitHub..."
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✓ Successfully pushed to GitHub!"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "Repository URL:"
    echo "https://github.com/$GITHUB_USER/metalayer"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "Push failed. Common solutions:"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1. Create the repository first:"
    echo "   https://github.com/new"
    echo "   Name: metalayer"
    echo "   Don't initialize with README"
    echo ""
    echo "2. Use a Personal Access Token when prompted for password:"
    echo "   Generate at: https://github.com/settings/tokens"
    echo "   Scopes needed: repo (full control)"
    echo ""
    echo "3. Or use GitHub CLI:"
    echo "   gh auth login"
    echo "   gh repo create metalayer --public --source=. --push"
    echo ""
fi
