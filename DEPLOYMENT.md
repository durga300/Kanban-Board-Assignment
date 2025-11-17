# Storybook Deployment Guide

This guide will help you deploy your Kanban Board Storybook to get a public preview link.

## Prerequisites

1. Node.js installed on your machine
2. A Vercel account (free at [vercel.com](https://vercel.com))

## Deployment Steps

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```
   npm install -g vercel
   ```

2. Deploy the pre-built Storybook:
   ```
   npx vercel --prod --dir storybook-static
   ```

3. Follow the prompts:
   - When asked "Set up and deploy...", press Enter to continue
   - When asked "Which scope do you want to deploy to?", select your personal account
   - When asked "Found project...", confirm the settings
   - When asked "Want to override the settings?", type "n" and press Enter

4. Once deployed, Vercel will provide a URL like:
   ```
   https://your-project-name.vercel.app
   ```

### Option 2: Manual Deployment

1. Create a free account on any static hosting service:
   - [Vercel](https://vercel.com)
   - [Netlify](https://netlify.com)
   - [GitHub Pages](https://pages.github.com)

2. Upload the contents of the `storybook-static` folder to your chosen platform

3. Your Storybook will be available at the provided URL

## Notes

- The Storybook is already built in the `storybook-static` directory
- No need to run `npm run build-storybook` as it's already built
- The deployment will include all components and stories for your Kanban Board