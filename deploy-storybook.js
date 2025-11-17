#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Storybook Deployment Process...\n');

// Check if storybook-static directory exists
const storybookDir = path.join(__dirname, 'storybook-static');
if (!fs.existsSync(storybookDir)) {
  console.error('❌ Error: storybook-static directory not found!');
  console.log('Please run "npm run build-storybook" first.');
  process.exit(1);
}

console.log('✅ Found storybook-static directory\n');

// Check if vercel is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is already installed\n');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully\n');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI');
    console.log('Please install it manually with: npm install -g vercel');
    process.exit(1);
  }
}

console.log('🌐 Deploying Storybook to Vercel...');
console.log('Follow the prompts below:\n');

try {
  // Run vercel deployment
  execSync(`npx vercel --prod --dir "${storybookDir}"`, { stdio: 'inherit' });
  console.log('\n✅ Deployment completed successfully!');
  console.log('\n📝 Note: If this is your first deployment, you\'ll need to confirm the project settings.');
  console.log('For subsequent deployments, the script will automatically deploy to the same project.');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}