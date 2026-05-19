# External Setup Guide

# Nearby Business Feasibility & Location Intelligence Platform

## Document control

| Field | Value |
| --- | --- |
| Document type | External Setup Guide |
| Product name | Nearby Business Feasibility & Location Intelligence Platform |
| Short name | Nearby Report |
| Version | 1.0 |
| Status | Setup guide for external dependencies |
| Primary audience | DevOps engineers, system administrators, deployment engineers |
| Purpose | Document all manual setup steps required before AI coding agent implementation |

---

## Overview

This document provides step-by-step instructions for setting up all external services, API keys, secrets, and configurations required for the Nearby Report platform. These setups must be completed manually outside of the coding agent IDE before development can begin.

**Estimated Setup Time**: 2-3 hours
**Cost**: Free to start (all services have free tiers or trial periods)

---

## Prerequisites

Before starting, ensure you have:
- Google account (for Google Cloud Console)
- OpenAI account (for OpenAI API)
- GitHub account (for Vercel deployment)
- Valid email address (for Supabase)
- Credit card (for verification purposes, though free tiers available)

---

## Setup Checklist

- [ ] 1. Google Maps API Key
- [ ] 2. Google Places API Key
- [ ] 3. OpenAI API Key
- [ ] 4. Supabase Database
- [ ] 5. Generate NEXTAUTH_SECRET
- [ ] 6. Vercel Account
- [ ] 7. Configure Environment Variables
- [ ] 8. Test All Connections

---

## 1. Google Maps API Key

### Purpose
Geocoding, reverse geocoding, and address autocomplete functionality.

### Steps

#### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Project name: `nearby-report` (or your preferred name)
5. Click "Create"

#### 1.2 Enable Maps JavaScript API

1. In Google Cloud Console, navigate to: APIs & Services → Library
2. Search for "Maps JavaScript API"
3. Click on it, then click "Enable"
4. Wait for API to be enabled

#### 1.3 Enable Geocoding API

1. Navigate to: APIs & Services → Library
2. Search for "Geocoding API"
3. Click on it, then click "Enable"
4. Wait for API to be enabled

#### 1.4 Enable Places API

1. Navigate to: APIs & Services → Library
2. Search for "Places API"
3. Click on it, then click "Enable"
4. Wait for API to be enabled

#### 1.5 Create API Key

1. Navigate to: APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Save it securely (you'll need it for environment variables)

#### 1.6 Configure API Key Restrictions (Optional but Recommended)

1. Click on the API key you just created
2. Under "Application restrictions", select:
   - **IP addresses**: Add your server IP if known
   - **HTTP referrers**: Add your domain (e.g., `*.nearby-report.com`)
3. Under "API restrictions", select "Restrict key" and select:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Click "Save"

### Cost Information

- **Free tier**: $200 free credit per month
- **Pricing after credit**: $5 per 1,000 geocoding requests
- **Estimated MVP cost**: ~$40/month (10k requests)

### Required Environment Variable

```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### Verification

Test your API key:
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY"
```

---

## 2. Google Places API Key

### Purpose
Nearby POI discovery, place details, and category data.

### Steps

**Note**: The Google Places API uses the same API key as Google Maps API. If you completed Section 1, you already have this key.

#### 2.1 Enable Additional Places APIs

1. Navigate to: APIs & Services → Library
2. Enable the following APIs:
   - Places API (already enabled in Section 1.4)
   - Places Details API (for detailed place information)

#### 2.2 Configure Places API Restrictions

1. Navigate to: APIs & Services → Credentials
2. Click on your API key
3. Under "API restrictions", ensure "Places API" is selected
4. Click "Save"

### Cost Information

- **Free tier**: $200 free credit per month
- **Pricing after credit**: $17 per 1,000 places requests
- **Estimated MVP cost**: ~$70/month (10k requests)

### Required Environment Variable

```bash
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### Verification

Test your API key:
```bash
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.7749,-122.4194&radius=500&type=restaurant&key=YOUR_API_KEY"
```

---

## 3. OpenAI API Key

### Purpose
AI-generated report summaries, opportunities, and risks using GPT-4o Mini.

### Steps

#### 3.1 Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Complete phone verification if required

#### 3.2 Create API Key

1. Navigate to: API Keys → Create new secret key
2. Name: `nearby-report-production` (or your preferred name)
3. Click "Create secret key"
4. **IMPORTANT**: Copy the key immediately (you won't see it again)
5. Save it securely

#### 3.3 Set Billing

1. Navigate to: Settings → Billing
2. Add payment method (credit card required)
3. Set spending limit (recommended: $50/month for MVP)
4. Choose "Pay as you go" billing

#### 3.4 Verify Model Access

1. Navigate to: Playground
2. Select model: `gpt-4o-mini`
3. Ensure the model is available
4. If not available, you may need to request access or upgrade your plan

### Cost Information

- **Model**: GPT-4o Mini (cost-optimized)
- **Pricing**: $0.15/1M input tokens, $0.60/1M output tokens
- **Estimated MVP cost**: ~$50/month (100 reports)
- **Free trial**: $5 free credit for new accounts

### Required Environment Variable

```bash
OPENAI_API_KEY=your_api_key_here
```

### Verification

Test your API key:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 4. Supabase Database

### Purpose
PostgreSQL database with PostGIS extensions for geospatial queries.

### Steps

#### 4.1 Create Supabase Account

1. Go to [Supabase](https://supabase.com/)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Complete email verification if required

#### 4.2 Create New Project

1. Click "New Project"
2. Project name: `nearby-report`
3. Database password: Generate a strong password (save it securely)
4. Region: Choose region closest to your users (e.g., Singapore for India)
5. Pricing plan: Select "Free" tier for MVP
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

#### 4.3 Get Database Connection String

1. Navigate to: Project Settings → Database
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Example connection string:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### 4.4 Enable PostGIS Extension

1. Navigate to: SQL Editor
2. Click "New query"
3. Run the following SQL:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### 4.5 Configure Database Access

1. Navigate to: Project Settings → Database
2. Scroll to "Connection pooling"
3. Enable "Connection pooling" (recommended for production)
4. Note the pooling connection string (different from direct connection string)

### Cost Information

- **Free tier**: 500MB database storage, 1GB bandwidth/month
- **Pricing after free tier**: $25/month for Pro plan
- **Estimated MVP cost**: $0/month (free tier sufficient for MVP)

### Required Environment Variable

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Verification

Test database connection:
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

Or using the Supabase SQL Editor:
```sql
SELECT version();
```

---

## 5. Generate NEXTAUTH_SECRET

### Purpose
Secret key for NextAuth.js authentication session encryption.

### Steps

#### 5.1 Generate Secret Key (macOS/Linux)

Open terminal and run:
```bash
openssl rand -base64 32
```

#### 5.2 Generate Secret Key (Windows)

Open PowerShell and run:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

#### 5.3 Save the Secret

1. Copy the generated secret
2. Save it securely (password manager recommended)
3. Do not share this secret or commit it to version control

### Cost Information

Free (no cost)

### Required Environment Variables

```bash
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000  # For local development
# For production:
# NEXTAUTH_URL=https://your-domain.com
```

---

## 6. Vercel Account

### Purpose
Deployment platform for the Next.js application.

### Steps

#### 6.1 Create Vercel Account

1. Go to [Vercel](https://vercel.com/)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub account

#### 6.2 Create New Project

1. Click "Add New" → "Project"
2. Import your GitHub repository (will be created after development)
3. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Click "Deploy"

#### 6.3 Configure Environment Variables in Vercel

1. Navigate to: Project Settings → Environment Variables
2. Add the following environment variables:
   ```
   DATABASE_URL
   GOOGLE_MAPS_API_KEY
   GOOGLE_PLACES_API_KEY
   OPENAI_API_KEY
   NEXTAUTH_SECRET
   NEXTAUTH_URL
   ```
3. For each variable:
   - Enter the variable name
   - Enter the value (use the values from previous sections)
   - Select environments: Production, Preview, Development
   - Click "Add"

#### 6.4 Configure Domain (Optional)

1. Navigate to: Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `nearby-report.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate to be issued

### Cost Information

- **Free tier**: Unlimited deployments, 100GB bandwidth/month
- **Pro plan**: $20/month (includes faster builds, analytics)
- **Estimated MVP cost**: $0/month (free tier sufficient)

### Deployment URL

After deployment, Vercel will provide:
- Production URL: `https://your-project.vercel.app`
- Preview URLs: `https://your-git-branch.vercel.app`

---

## 7. Configure Environment Variables

### Purpose
Centralized configuration of all external service credentials.

### Local Development Setup

Create a `.env.local` file in your project root:

```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Google APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Authentication
NEXTAUTH_SECRET=your_generated_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Setup (Vercel)

1. Navigate to: Project Settings → Environment Variables
2. Add all variables from local setup
3. Update `NEXTAUTH_URL` to production domain:
   ```bash
   NEXTAUTH_URL=https://your-domain.com
   ```
4. Update `NEXT_PUBLIC_APP_URL` to production domain:
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

### Security Best Practices

- **NEVER** commit `.env.local` to version control
- **NEVER** share API keys or secrets
- Use different API keys for development and production if possible
- Rotate API keys regularly
- Monitor API usage and costs

---

## 8. Test All Connections

### Purpose
Verify all external services are properly configured.

### Test Checklist

#### 8.1 Test Database Connection

```bash
# Using psql
psql "$DATABASE_URL"

# Or using Prisma
npx prisma db pull
```

#### 8.2 Test Google Maps API

```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Bangalore&key=$GOOGLE_MAPS_API_KEY"
```

Expected: JSON response with geocoding data for Bangalore

#### 8.3 Test Google Places API

```bash
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=12.9716,77.5946&radius=1000&type=cafe&key=$GOOGLE_PLACES_API_KEY"
```

Expected: JSON response with nearby cafes in Bangalore

#### 8.4 Test OpenAI API

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Expected: JSON response with chat completion

#### 8.5 Test NextAuth Secret

This will be tested when the application runs. If the secret is invalid, NextAuth will fail to initialize.

---

## Troubleshooting

### Google Maps API Issues

**Problem**: API returns "REQUEST_DENIED" error
- **Solution**: Check API key restrictions in Google Cloud Console
- **Solution**: Ensure all required APIs are enabled
- **Solution**: Verify API key is correct

### OpenAI API Issues

**Problem**: API returns "Invalid API key" error
- **Solution**: Verify API key is correct
- **Solution**: Check billing is configured
- **Solution**: Ensure model access is enabled

### Supabase Issues

**Problem**: Database connection fails
- **Solution**: Verify connection string includes correct password
- **Solution**: Check database is active (not paused)
- **Solution**: Ensure PostGIS extension is enabled

### Vercel Deployment Issues

**Problem**: Build fails due to missing environment variables
- **Solution**: Add all required environment variables in Vercel project settings
- **Solution**: Ensure variables are selected for all environments

---

## Cost Monitoring

### Monthly Cost Estimates

| Service | Free Tier | Estimated MVP Cost |
| --- | --- | --- |
| Google Maps API | $200/month credit | ~$40/month |
| Google Places API | $200/month credit | ~$70/month |
| OpenAI API | $5 one-time credit | ~$50/month |
| Supabase | 500MB storage | $0/month |
| Vercel | 100GB bandwidth | $0/month |
| **Total** | | **~$160/month** |

### Cost Alerts

**Google Cloud:**
1. Navigate to: Billing → Budgets & alerts
2. Create budget: $50/month
3. Set alert at 80% of budget

**OpenAI:**
1. Navigate to: Settings → Usage
2. Set hard limit: $50/month
3. Enable email alerts at 80% usage

**Supabase:**
1. Monitor database storage in dashboard
2. Upgrade to Pro plan if approaching 500MB limit

---

## Security Checklist

- [ ] All API keys stored securely (password manager)
- [ ] Environment variables not committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] API key restrictions configured (Google Cloud)
- [ ] Spending limits set (OpenAI, Google Cloud)
- [ ] Database password is strong and unique
- [ ] NEXTAUTH_SECRET is cryptographically random
- [ ] HTTPS enabled in production (Vercel provides this)
- [ ] Regular API key rotation planned
- [ ] Backup strategy for database (Supabase provides automatic backups)

---

## Support Resources

### Google Cloud Console
- Documentation: https://cloud.google.com/docs
- Support: https://cloud.google.com/support

### OpenAI
- Documentation: https://platform.openai.com/docs
- Support: https://help.openai.com

### Supabase
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support

### Vercel
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

---

## Next Steps

After completing all external setups:

1. **Verify all connections** using the test checklist in Section 8
2. **Document all credentials** in a secure location
3. **Share credentials with development team** (if applicable)
4. **Begin AI coding agent implementation** of the development-progress.md plan
5. **Monitor API usage** during development to avoid unexpected costs

---

## Appendix A: Quick Reference

### Environment Variables Summary

```bash
# Required for all environments
DATABASE_URL=
GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=
OPENAI_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_APP_URL=
```

### API Key Locations

| Service | Console URL |
| --- | --- |
| Google Cloud | https://console.cloud.google.com |
| OpenAI | https://platform.openai.com/api-keys |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |

### Useful Commands

```bash
# Generate NEXTAUTH_SECRET (macOS/Linux)
openssl rand -base64 32

# Test database connection
psql "$DATABASE_URL"

# Test Google Maps API
curl "https://maps.googleapis.com/maps/api/geocode/json?address=test&key=$GOOGLE_MAPS_API_KEY"

# Test OpenAI API
curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-16  
**Maintained By**: DevOps Team
