# Deployment Instructions

Follow these steps to deploy your Kanban Board Storybook and create your assignment submission:

## GitHub Repository Setup

1. Go to https://github.com/new
2. Create a new repository named "kanban-board-component"
3. Make sure it's Public (not Private)
4. Do NOT initialize with a README
5. Click "Create repository"

## Connect Local Repository to GitHub

Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/kanban-board-component.git
git branch -M main
git push -u origin main
```

## Storybook Deployment to Vercel

1. Login to Vercel:
   ```bash
   vercel login
   ```
   
2. When prompted, visit the URL shown in your terminal to authenticate with your GitHub account

3. After authentication, deploy your Storybook:
   ```bash
   vercel storybook-static --prod
   ```

4. When prompted:
   - Select your Vercel scope (usually your username)
   - Confirm the project name (e.g., "kanban-board-component")
   - Set the directory to `storybook-static`
   - Confirm the deployment

## Your Assignment Submission

Once both steps are complete, you'll have:

1. **GitHub Repo Link**: `https://github.com/YOUR_GITHUB_USERNAME/kanban-board-component`
2. **Storybook Preview Link**: The URL provided by Vercel after deployment (will look like `https://kanban-board-component.vercel.app`)

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js is installed on your system
2. Ensure you have a stable internet connection
3. If Vercel CLI has issues, try:
   ```bash
   npm install -g vercel
   ```
4. If git has issues, make sure you're using the correct GitHub username and that your repository was created successfully

## Need Help?

If you're still having trouble, please reach out for assistance with specific error messages you're seeing.