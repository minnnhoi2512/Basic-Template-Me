#!/bin/bash

# Git Script for TypeScript Node.js project

# Variables
COMMIT_MESSAGE="$1"
BRANCH="${2:-main}"  # Default to 'main', override with second argument
REMOTE_URL="https://github.com/minnnhoi2512/Basic-Template-Me.git"

# Check if commit message is provided
if [ -z "$COMMIT_MESSAGE" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./git-script.sh \"Your commit message\" [branch]"
  exit 1
fi

# Ensure we're in a Git repository
if [ ! -d .git ]; then
  echo "Initializing Git repository..."
  git init
fi

# Add all changes
echo "Staging all changes..."
git add .

# Commit changes
echo "Committing changes with message: '$COMMIT_MESSAGE'..."
git commit -m "$COMMIT_MESSAGE" || {
  echo "Nothing to commit."
  exit 0
}

# Add remote if not already set
if ! git remote | grep -q "origin"; then
  echo "Adding remote origin: $REMOTE_URL"
  git remote add origin "$REMOTE_URL"
fi

# Push to remote, set upstream if needed
echo "Pushing to $BRANCH..."
if git rev-parse --verify "origin/$BRANCH" > /dev/null 2>&1; then
  git push origin "$BRANCH"
else
  git push -u origin "$BRANCH"
fi

echo "Done!"