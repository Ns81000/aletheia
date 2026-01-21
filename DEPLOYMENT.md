# Deployment Guide - Aletheia

Complete guide to deploying Aletheia to Vercel and other platforms.

## Table of Contents

- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

Aletheia is optimized for Vercel and can be deployed with zero configuration.

### Option 1: Connect GitHub Repository (Automatic Deployments)

**Recommended for continuous deployment**

1. **Visit Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Sign in with GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Select "Ns81000/aletheia" from GitHub
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./ (default)
   - **Build Command**: `pnpm build` (auto-detected)
   - **Output Directory**: .next (auto-detected)
   - **Install Command**: `pnpm install --frozen-lockfile` (auto-detected)

4. **Environment Variables** (Optional)
   - Add any required environment variables in the "Environment Variables" section
   - Example: `NEXT_PUBLIC_API_URL=https://yourdomain.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~2-3 minutes)
   - Access your site at the provided URL

6. **Enable Auto-Deployments**
   - Go to "Settings" → "Git"
   - Ensure "Vercel for GitHub" is connected
   - Automatic deployments on every push to main

### Option 2: Deploy via CLI

**For command-line deployment**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from project directory
cd /path/to/aletheia
vercel

# 4. Follow prompts and select:
# - Link to existing project or create new
# - Verify settings
# - Deploy

# 5. View deployment
# Vercel will provide your URL
```

### Option 3: Manual Git Push

```bash
# 1. Ensure code is pushed to GitHub
git push origin main

# 2. Vercel automatically detects new pushes
# 3. Deployment starts automatically
# 4. Monitor deployment in Vercel dashboard
```

---

## Local Development

### Setup Development Environment

```bash
# 1. Clone repository
git clone https://github.com/Ns81000/aletheia.git
cd aletheia

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Open browser
# Visit http://localhost:3000
```

### Development Commands

```bash
# Start dev server with hot reload
pnpm dev

# Run TypeScript type checking
pnpm type-check

# Lint code with ESLint
pnpm lint

# Format code with Prettier
pnpm format

# All checks at once
pnpm type-check && pnpm lint && pnpm format
```

---

## Production Build

### Build Locally

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build application
pnpm build

# 3. Run production server
pnpm start

# Application runs on http://localhost:3000
```

### Build Verification

```bash
# Check for TypeScript errors
pnpm type-check

# Check for linting issues
pnpm lint

# Build and check output size
pnpm build

# Inspect build output
ls -la .next/
```

---

## Environment Variables

### Required Variables

None are strictly required for basic functionality. The app works out of the box.

### Optional Variables

```env
# .env.local (for development)
# .env.production (for production via Vercel)

# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com

# GitHub Integration
NEXT_PUBLIC_GITHUB_REPO=https://github.com/Ns81000/aletheia

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-ga-id
```

### In Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add variables for different environments:
   - Preview (pull requests)
   - Production (main branch)
   - Development (local)

3. Format: `KEY=VALUE`

---

## Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.6

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["pnpm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t aletheia:latest .

# Run container
docker run -p 3000:3000 aletheia:latest

# Access at http://localhost:3000
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  aletheia:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Other Hosting Platforms

### Netlify Deployment

```bash
# 1. Connect GitHub to Netlify
# 2. In Netlify settings:

# Build command:
pnpm build

# Publish directory:
.next

# Environment variables:
# Add any required variables
```

### Railway Deployment

```bash
# 1. Create Railway account at railway.app
# 2. Connect GitHub repository
# 3. Railway auto-detects Next.js project
# 4. Deployment happens automatically
```

### Heroku Deployment

```bash
# Create Procfile
echo "web: pnpm start" > Procfile

# Deploy
git push heroku main
```

---

## Performance Optimization

### Enable Caching

```bash
# In vercel.json (already configured)
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

### Image Optimization

Already enabled in `next.config.mjs`:
- WebP format support
- AVIF format support
- Automatic optimization

### Build Optimization

```bash
# Analyze bundle size
pnpm build --analyze

# Check what's being bundled
npx next-bundle-analyzer
```

---

## Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel Dashboard
2. Select your project
3. Navigate to "Analytics" tab
4. View:
   - Page load times
   - Core Web Vitals
   - Error rates
   - Traffic patterns

### Application Monitoring

```javascript
// In your app for basic monitoring
console.log('Deployment check: OK');
console.log('Environment: ' + process.env.NODE_ENV);
```

---

## Security Checklist

Before deploying to production:

- ✅ All dependencies updated (`pnpm update`)
- ✅ No console.log statements in production code
- ✅ Environment variables set in Vercel
- ✅ HTTPS enabled (Vercel default)
- ✅ Security headers configured (vercel.json)
- ✅ TypeScript type checking passes
- ✅ ESLint checks pass
- ✅ No sensitive data in code
- ✅ README and LICENSE included
- ✅ vercel.json reviewed

---

## Troubleshooting

### Build Fails on Vercel

**Error: "pnpm not found"**
```
Solution: Vercel usually auto-detects pnpm. If not, in project settings set:
Environment: NODE_ENV=production
Ensure packageManager field in package.json
```

**Error: "Port already in use"**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Deployment is Slow

- Check build logs in Vercel dashboard
- Verify dependencies are necessary
- Consider code splitting
- Check for large images

### Environment Variables Not Working

```bash
# Verify in Vercel dashboard:
1. Go to Settings → Environment Variables
2. Check variable is set for correct environment
3. Redeploy for changes to take effect

# Or trigger redeploy:
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Pages Return 404

- Verify files are in correct directories
- Check next.config.mjs for rewrites
- Ensure dynamic routes use [param] format

### Memory Issues

```
Solution: Optimize build:
1. Remove unnecessary dependencies
2. Reduce bundle size
3. Consider Vercel Pro for more memory
```

---

## Rollback Deployment

### Via Vercel Dashboard

1. Go to "Deployments" tab
2. Find previous stable deployment
3. Click three dots → "Promote to Production"

### Via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel auto-deploys the reverted version
```

---

## Custom Domain

1. **In Vercel Dashboard**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter your domain

2. **Update DNS**
   - Follow Vercel's DNS configuration
   - Point to Vercel nameservers

3. **Enable HTTPS**
   - Automatic with Vercel (free SSL)
   - Takes ~1 hour to activate

---

## Scaling & Performance

### For High Traffic

1. **Upgrade to Vercel Pro**
   - Faster builds
   - More concurrent deployments
   - Priority support

2. **Database Optimization**
   - Add caching layer
   - Optimize queries
   - Consider edge caching

3. **Content Delivery**
   - Already optimized with Vercel CDN
   - Images cached globally
   - GZIP compression enabled

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **GitHub Issues**: https://github.com/Ns81000/aletheia/issues
- **GitHub Discussions**: https://github.com/Ns81000/aletheia/discussions

---

**Last Updated**: January 2026
**Aletheia Version**: 1.0.0+
