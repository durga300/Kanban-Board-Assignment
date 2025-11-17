# GitHub Repository Setup Instructions

Follow these steps to create your GitHub repository and push the code:

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Name your repository (e.g., "kanban-board-component")
3. Make sure to keep it Public (not Private)
4. Do NOT initialize with a README
5. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username in the following commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kanban-board-component.git
git branch -M main
git push -u origin main
```

## Step 3: Verify the Push

After running the commands, visit your repository on GitHub to ensure all files have been uploaded correctly.

## Alternative: Using GitHub CLI

If you have GitHub CLI installed, you can create and push in one command:

```bash
gh repo create kanban-board-component --public --push
```