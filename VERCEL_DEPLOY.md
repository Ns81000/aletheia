# 🚀 Deploy Aletheia to Vercel in 2 Minutes

Quick deployment guide to get Aletheia live on Vercel instantly.

---

## ⚡ Quick Deploy (Zero Configuration)

### Step 1: Visit Vercel
Open your browser and go to: **https://vercel.com/new**

### Step 2: Sign In
Sign in with your GitHub account

### Step 3: Import Repository
1. Select "Import Git Repository"
2. Search for: `Ns81000/aletheia`
3. Click "Import"

### Step 4: Configure (Optional)
The project is pre-configured with `vercel.json`, but you can review:
- **Framework Preset**: Next.js ✅ (auto-detected)
- **Build Command**: `pnpm build` ✅ (auto-detected)
- **Output Directory**: `.next` ✅ (auto-detected)
- **Install Command**: `pnpm install` ✅ (auto-detected)
- **Node.js Version**: 18.17.0 ✅ (from `.nvmrc`)

### Step 5: Deploy
Click **"Deploy"** and wait ~2 minutes

### Step 6: Done! 🎉
Your site is live! Vercel will provide:
- Production URL: `https://aletheia-xxx.vercel.app`
- Custom domain support
- Automatic HTTPS
- Global CDN

---

## 🎯 What Happens During Deployment

```
[1/6] Installing dependencies with pnpm...       ✅ ~30 seconds
[2/6] Running TypeScript type checking...        ✅ ~10 seconds
[3/6] Building Next.js application...            ✅ ~60 seconds
[4/6] Optimizing and generating static pages...  ✅ ~20 seconds
[5/6] Deploying to Vercel CDN...                 ✅ ~10 seconds
[6/6] Running final checks...                    ✅ ~5 seconds

✨ Deployment Complete!
```

---

## 📱 Access Your Deployed Site

After deployment, you'll get:

1. **Production URL**: 
   ```
   https://aletheia-[random-id].vercel.app
   ```

2. **Dashboard Access**:
   - Visit: https://vercel.com/dashboard
   - View deployment logs
   - Monitor analytics
   - Configure domains

3. **Automatic Updates**:
   - Every push to GitHub `main` branch auto-deploys
   - Pull requests get preview URLs
   - Rollback capability from dashboard

---

## 🔧 Post-Deployment Configuration

### Add Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `aletheia.example.com`)
4. Update DNS records as instructed
5. HTTPS certificate auto-generated

### Environment Variables (Optional)

If you need environment variables:
1. Go to "Settings" → "Environment Variables"
2. Add variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```
3. Redeploy for changes to take effect

---

## 📊 Verify Deployment

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. View "Build Logs" tab
4. Confirm all steps passed ✅

### Test Your Site
Visit your production URL and verify:
- ✅ Homepage loads correctly
- ✅ Dark mode toggle works
- ✅ Search functionality active
- ✅ Example domains clickable
- ✅ GitHub link in footer works
- ✅ No console errors

### Performance Check
Run Lighthouse audit:
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Click "Generate report"
4. Expected scores:
   - Performance: 95+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 95+

---

## 🔄 Enable Automatic Deployments

Vercel automatically deploys on every push to `main` branch.

**To trigger a new deployment:**
```bash
# Make a change and push
git add .
git commit -m "your changes"
git push origin main

# Vercel automatically detects and deploys
```

---

## 🛠️ Troubleshooting

### Build Failed?

**Check Build Logs:**
1. Go to Vercel Dashboard
2. Click failed deployment
3. View "Build Logs"
4. Look for error messages

**Common Issues:**

**Issue**: "pnpm not found"
```
Solution: Ensure packageManager field exists in package.json
Already configured ✅
```

**Issue**: "Module not found"
```
Solution: Run locally first to verify:
pnpm install
pnpm build
```

**Issue**: "Out of memory"
```
Solution: Vercel has generous limits. If issue persists,
consider upgrading to Vercel Pro or optimize bundle size.
```

### Deployment is Slow?
- First deployment: ~3-5 minutes (normal)
- Subsequent deployments: ~1-2 minutes
- Check Vercel status: https://vercel-status.com

---

## 🎨 Preview Deployments

Every pull request gets a preview URL:

1. Create a PR on GitHub
2. Vercel auto-generates preview URL
3. Test changes before merging
4. Merge PR → auto-deploy to production

---

## 📈 Monitor Your Deployment

### Vercel Analytics
Free analytics included:
- Page views
- Load times
- Core Web Vitals
- Geographic distribution
- Device breakdown

### Access Analytics:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab

---

## 🔐 Security

Vercel automatically provides:
- ✅ HTTPS/SSL certificates
- ✅ DDoS protection
- ✅ Web Application Firewall
- ✅ Security headers (configured in `vercel.json`)
- ✅ Automatic vulnerability scanning

---

## 💰 Pricing

**Hobby Plan (Free):**
- ✅ Unlimited deployments
- ✅ HTTPS included
- ✅ Global CDN
- ✅ 100GB bandwidth
- ✅ Perfect for Aletheia

**Pro Plan ($20/month):**
- More bandwidth
- Priority support
- Advanced analytics
- Team collaboration

For most users, the **free Hobby plan is sufficient**.

---

## 🌟 Success Checklist

After deployment, verify:
- ✅ Site loads at production URL
- ✅ All pages accessible
- ✅ Dark mode works
- ✅ Search functionality active
- ✅ GitHub link works
- ✅ Footer displays correctly
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ No browser console errors
- ✅ Performance score 90+

---

## 🎯 Next Steps

### Share Your Deployment
1. Copy your Vercel URL
2. Share on social media
3. Add to your portfolio
4. Send to friends and colleagues

### Monitor Performance
1. Check Vercel Analytics regularly
2. Monitor error rates
3. Review Core Web Vitals
4. Optimize if needed

### Keep Updated
```bash
# Pull latest changes from repository
git pull origin main

# Vercel auto-deploys on push
git push origin main
```

---

## 📞 Support

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/deployments/overview

### GitHub Repository
- Issues: https://github.com/Ns81000/aletheia/issues
- Discussions: https://github.com/Ns81000/aletheia/discussions

### Vercel Support
- Help: https://vercel.com/help
- Status: https://vercel-status.com

---

## 🎊 Congratulations!

Your Aletheia certificate intelligence platform is now live and accessible worldwide!

**Your deployment includes:**
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Preview environments
- ✅ Analytics dashboard
- ✅ 99.99% uptime SLA

---

**Built with ❤️ for a safer web**

Project: Aletheia  
Creator: Ns81000  
Repository: https://github.com/Ns81000/aletheia  
License: MIT with Attribution

---

*Last Updated: January 21, 2026*
