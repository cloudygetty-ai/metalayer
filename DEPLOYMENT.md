# Metalayer — Deployment Guide

Complete guide for deploying Metalayer to production environments.

---

## Pre-Deployment Checklist

- [ ] Environment variables configured in `.env.local`
- [ ] API backend URL set correctly
- [ ] API keys secured (not committed to git)
- [ ] Build tested locally (`npm run build && npm run preview`)
- [ ] All four engines tested end-to-end
- [ ] Memory persistence verified
- [ ] Tone profiles saving/loading correctly
- [ ] Routing decisions logging properly
- [ ] Mobile responsiveness checked

---

## Deployment Methods

### Method 1: Docker (Recommended)

**Single container:**
```bash
# Build
docker build -t metalayer-frontend .

# Run
docker run -p 3000:80 \
  -e VITE_API_URL=https://api.metalayer.ai \
  metalayer-frontend
```

**Full stack with docker-compose:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

### Method 2: Static Hosting (Vercel, Netlify, Cloudflare Pages)

**Build command:**
```bash
npm run build
```

**Output directory:**
```
dist/
```

**Environment variables to set:**
- `VITE_API_URL` — Your backend API URL
- `VITE_API_KEY` — API authentication key

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Cloudflare Pages:**
- Connect GitHub repo
- Build command: `npm run build`
- Output: `dist`
- Add environment variables in dashboard

### Method 3: Traditional Server (Nginx)

```bash
# 1. Build locally
npm run build

# 2. Copy dist/ to server
scp -r dist/* user@server:/var/www/metalayer/

# 3. Configure Nginx (use provided nginx.conf)
sudo cp nginx.conf /etc/nginx/sites-available/metalayer
sudo ln -s /etc/nginx/sites-available/metalayer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:8000
VITE_ENV=development
VITE_ENABLE_ANALYTICS=false
```

### Staging
```env
VITE_API_URL=https://staging-api.metalayer.ai
VITE_ENV=staging
VITE_ENABLE_ANALYTICS=true
```

### Production
```env
VITE_API_URL=https://api.metalayer.ai
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_TELEMETRY=true
```

---

## Backend Integration

Replace the client-side optimizer simulation in `src/lib/store.js`:

```js
import { api } from '@/lib/api'

// Inside useOptimizerStore:
optimizePrompt: async (rawPrompt) => {
  if (!rawPrompt.trim()) return null
  set({ isOptimizing: true })

  try {
    const { getToneDescriptor } = useToneStore.getState()
    const { retrieveRelevant }   = useMemoryStore.getState()
    const { getActiveRule }      = useRoutingStore.getState()

    const toneDesc      = getToneDescriptor()
    const relevantMem   = retrieveRelevant(rawPrompt)
    const routingModel  = getActiveRule(rawPrompt)

    // Real API call
    const result = await api.optimizePrompt({
      prompt: rawPrompt,
      tone: {
        directness:  useToneStore.getState().directness,
        warmth:      useToneStore.getState().warmth,
        formality:   useToneStore.getState().formality,
        conciseness: useToneStore.getState().conciseness,
      },
      memoryItems: relevantMem,
      targetModel: routingModel,
    })

    const entry = {
      id:              Date.now().toString(),
      rawPrompt,
      optimizedPrompt: result.optimizedPrompt,
      toneApplied:     toneDesc,
      memoryItems:     relevantMem.map(m => m.id),
      modelRouted:     routingModel,
      createdAt:       new Date().toISOString(),
    }

    set(state => ({
      history:      [entry, ...state.history].slice(0, 50),
      isOptimizing: false,
    }))

    return entry
  } catch (error) {
    console.error('Optimization failed:', error)
    set({ isOptimizing: false })
    throw error
  }
}
```

---

## Performance Optimization

### Build Optimization
```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'store': ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### Code Splitting
Already implemented via dynamic component loading in App.jsx.

### Lazy Loading
For future enhancement, convert page components to lazy:
```js
const ToneEngine = lazy(() => import('@/components/ToneEngine/ToneEngine'))
```

---

## Monitoring & Analytics

### Health Check
The app exposes state via Zustand stores. Add a health endpoint:

```js
// src/lib/health.js
export function getAppHealth() {
  return {
    status: 'healthy',
    stores: {
      tone:      useToneStore.getState(),
      memory:    useMemoryStore.getState().items.length,
      optimizer: useOptimizerStore.getState().history.length,
      routing:   useRoutingStore.getState().rules.length,
    },
    timestamp: new Date().toISOString(),
  }
}
```

### Error Tracking
Add Sentry or similar:
```js
// src/main.jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV,
})
```

---

## Security Considerations

1. **API Keys**: Never commit `.env` files. Use platform environment variables.
2. **CORS**: Configure backend to accept requests from your frontend domain only.
3. **Content Security Policy**: Add CSP headers in nginx.conf
4. **Rate Limiting**: Implement on backend API
5. **Input Sanitization**: Already handled by React, but validate on backend

---

## Scaling

### Horizontal Scaling
- Deploy multiple frontend containers behind a load balancer
- Use CDN for static assets (Cloudflare, AWS CloudFront)
- Separate static assets to object storage (S3)

### Caching Strategy
- Browser cache: 1 year for JS/CSS bundles (handled by Nginx config)
- API responses: Cache GET requests at CDN level
- LocalStorage: Already persisting Zustand state

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Store Not Persisting
Check browser LocalStorage quotas. If exceeded, implement cleanup:
```js
// Limit history size in store
history: [entry, ...state.history].slice(0, 20)  // Reduce from 50
```

### API Connection Issues
- Verify VITE_API_URL is set correctly
- Check CORS configuration on backend
- Inspect network tab for failed requests
- Add retry logic to api.js

---

## Rollback Procedure

### Docker
```bash
docker tag metalayer-frontend:previous metalayer-frontend:latest
docker-compose up -d frontend
```

### Static Hosting
Most platforms (Vercel, Netlify) support instant rollback via dashboard.

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs frontend`
2. Verify environment variables are set
3. Test API endpoint directly: `curl $VITE_API_URL/health`
4. Review Nginx error logs: `/var/log/nginx/error.log`
