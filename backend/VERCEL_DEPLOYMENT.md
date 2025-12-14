# Vercel Deployment Guide

## Overview

This backend is configured to deploy on Vercel as a serverless function.

## Configuration Files

### `vercel.json`
- Configures Vercel to use `@vercel/node` runtime for TypeScript
- Sets up routing for all API endpoints
- Configures function memory (1024MB) and timeout (30s)

### `api/index.ts`
- Serverless function handler for Vercel
- Handles MongoDB connection (cached across invocations)
- Routes all requests through Express app

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Backend Directory
```bash
cd backend
vercel
```

### 4. Set Environment Variables

In Vercel Dashboard or via CLI:

```bash
vercel env add MONGO_URI
# Paste your MongoDB connection string when prompted

vercel env add PORT
# Enter: 3001 (or leave empty for default)
```

Or set in Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add `MONGO_URI` with your MongoDB Atlas connection string
- Add `PORT` (optional, defaults to 3001)

### 5. Production Deployment
```bash
vercel --prod
```

## Environment Variables Required

- `MONGO_URI` - MongoDB Atlas connection string (required)
- `PORT` - Server port (optional, defaults to 3001)
- `NODE_ENV` - Automatically set to "production" by Vercel

## API Endpoints

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/sales`
- `https://your-project.vercel.app/api/sales/filter-options`
- `https://your-project.vercel.app/health`

## Important Notes

1. **MongoDB Connection**: The connection is cached across serverless function invocations for better performance.

2. **Cold Starts**: First request after inactivity may take longer due to cold start. Subsequent requests will be faster.

3. **Function Limits**:
   - Memory: 1024MB
   - Max Duration: 30 seconds
   - Adjust in `vercel.json` if needed

4. **TypeScript**: Vercel automatically compiles TypeScript files in the `api/` directory.

5. **CORS**: CORS is enabled for all origins. Update in `api/index.ts` if you need to restrict it.

## Troubleshooting

### Connection Issues
- Verify `MONGO_URI` is set correctly in Vercel environment variables
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
- Ensure MongoDB Atlas allows connections from anywhere

### Build Errors
- Make sure all dependencies are in `package.json`
- Check that TypeScript compilation succeeds locally: `npm run build`

### Runtime Errors
- Check Vercel function logs in the dashboard
- Verify all imports use `.js` extensions (required for ES modules)

## Local Testing

Test the Vercel function locally:
```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless environment.

