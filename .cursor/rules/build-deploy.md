# Build & Deployment

## Build Configuration

### Vite Configuration
File: `vite.config.js`

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
    // Plugins
    plugins: [
        {
            name: 'reload',
            configureServer(server) {
                const { ws, watcher } = server
                watcher.on('change', (file) => {
                    if (file.endsWith('.html')) {
                        ws.send({
                            type: 'full-reload',
                        })
                    }
                })
            },
        },
    ],
    
    // Build options
    build: {
        // Output directory
        outDir: 'dist',
        
        // Generate sourcemaps for debugging
        sourcemap: false, // Set to true for debugging production
        
        // Multi-page configuration
        rollupOptions: {
            input: {
                main: 'index.html',
                default: 'default.html',
                post: 'post.html',
                detail: 'detail.html',
                user: 'user.html',
                admin: 'admin_manager_post.html',
                loginModal: '/src/modal/loginModal.html',
                registerModal: '/src/modal/registerModal.html',
            },
        },
        
        // Minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
            },
        },
        
        // Chunk size warnings
        chunkSizeWarningLimit: 1000,
    },
    
    // Development server
    server: {
        port: 5173,
        host: true, // Listen on all addresses
        allowedHosts: ['localhost', '127.0.0.1', 'doan.huancanhcut.click'],
        
        // Proxy API requests (if needed)
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, '')
        //     }
        // }
    },
    
    // Preview server (for production build)
    preview: {
        port: 4173,
        host: true,
    },
})
```

## Build Commands

### Development

```bash
# Start development server
yarn dev

# Development server sẽ chạy tại:
# http://localhost:5173

# Features:
# - Hot Module Replacement (HMR)
# - Fast refresh
# - Source maps
# - Full error overlay
```

### Production Build

```bash
# Build for production
yarn build

# Output:
# - dist/ directory
# - Minified JS/CSS
# - Optimized assets
# - Hash in filenames for cache busting
```

### Preview Production Build

```bash
# Build first
yarn build

# Preview the production build locally
yarn preview

# Preview server sẽ chạy tại:
# http://localhost:4173
```

## Build Output Structure

```
dist/
├── assets/
│   ├── index-[hash].js          # Main page JS
│   ├── post-[hash].js           # Post page JS
│   ├── details-[hash].js        # Details page JS
│   ├── index-[hash].css         # Main page CSS
│   ├── post-[hash].css          # Post page CSS
│   └── ...
├── static/                      # Static assets from public/
│   ├── logo.png
│   ├── favicon.ico
│   └── images/
├── locations/                   # Location data
│   ├── provinces.json
│   └── ...
├── index.html                   # Entry pages
├── post.html
├── details.html
└── ...
```

## Environment Variables

### Setup

Create `.env` files:

```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Real Estate Development
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.production.com
VITE_APP_NAME=Real Estate
VITE_DEBUG=false
```

### Usage in Code

```javascript
// Access environment variables
const API_URL = import.meta.env.VITE_API_URL
const APP_NAME = import.meta.env.VITE_APP_NAME
const IS_DEV = import.meta.env.DEV
const IS_PROD = import.meta.env.PROD

// Example usage
const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    debug: import.meta.env.VITE_DEBUG === 'true',
}

// Conditional code for development
if (import.meta.env.DEV) {
    console.log('Running in development mode')
    window.__DEBUG__ = { /* ... */ }
}
```

### Built-in Vite Variables

```javascript
import.meta.env.MODE          // 'development' or 'production'
import.meta.env.DEV           // true in dev, false in prod
import.meta.env.PROD          // false in dev, true in prod
import.meta.env.BASE_URL      // Base URL for the app
```

## Optimization

### 1. Code Splitting

Vite automatically code-splits by:
- Entry points (each HTML page)
- Dynamic imports

```javascript
// Dynamic import for code splitting
const loadModal = async () => {
    const { default: modal } = await import('./modal.js')
    return modal
}

// Usage
button.addEventListener('click', async () => {
    const modal = await loadModal()
    modal.open()
})
```

### 2. Asset Optimization

#### Images

```javascript
// Import images for optimization
import logoUrl from '/static/logo.png'

// Use in code
img.src = logoUrl

// Or direct reference (not optimized)
img.src = '/static/logo.png'
```

#### Lazy Loading Images

```html
<!-- Use data-src for lazy loading -->
<img 
    data-src="/static/property.jpg" 
    alt="Property"
    class="lazy-image"
/>

<script>
// Lazy load implementation
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
        }
    })
})

lazyImages.forEach(img => imageObserver.observe(img))
</script>
```

### 3. CSS Optimization

```scss
// Use CSS modules or scoped styles
// Vite will automatically:
// - Minify CSS
// - Remove unused CSS (tree-shaking)
// - Generate unique class names
// - Bundle and optimize

// Import only what you need
@import './variables.scss';
@import './mixins.scss';

// Avoid deep nesting (better for performance)
.card {
    // Max 3 levels deep
    &__header {
        &__title {
            // Stop here
        }
    }
}
```

### 4. JavaScript Optimization

```javascript
// Tree-shaking friendly exports
// ✅ GOOD - Named exports
export const functionA = () => { /* ... */ }
export const functionB = () => { /* ... */ }

// Import only what you need
import { functionA } from './utils'

// ❌ BAD - Default export of large object
export default {
    functionA: () => { /* ... */ },
    functionB: () => { /* ... */ },
    // ... many more
}
```

## Deployment

### Static Hosting (Recommended)

#### 1. Netlify

```bash
# Build command
yarn build

# Publish directory
dist

# netlify.toml
[build]
  command = "yarn build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Vercel

```bash
# Build command
yarn build

# Output directory
dist

# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

#### 3. GitHub Pages

```bash
# Install gh-pages
yarn add -D gh-pages

# Add to package.json scripts
"scripts": {
  "deploy": "yarn build && gh-pages -d dist"
}

# Deploy
yarn deploy
```

**vite.config.js for GitHub Pages:**

```javascript
export default defineConfig({
    base: '/repository-name/', // Replace with your repo name
    // ... other config
})
```

#### 4. Custom Server (VPS/Cloud)

```bash
# SSH to server
ssh user@your-server.com

# Navigate to web directory
cd /var/www/html

# Pull latest code
git pull origin main

# Install dependencies
yarn install

# Build
yarn build

# Copy dist to web root
cp -r dist/* ./

# Restart web server (if needed)
sudo systemctl restart nginx
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/your-site
server {
    listen 80;
    server_name doan.huancanhcut.click;
    
    root /var/www/html/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback (if needed)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Apache Configuration

```apache
# .htaccess in dist/
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Redirect to HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Cache static assets
    <FilesMatch "\.(jpg|jpeg|png|gif|svg|css|js|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'yarn'
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
    
    - name: Lint
      run: yarn lint
    
    - name: Build
      run: yarn build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --dir=dist --prod
```

## Performance Monitoring

### 1. Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-site.com --view

# Check scores:
# - Performance
# - Accessibility
# - Best Practices
# - SEO
```

### 2. Bundle Analysis

```bash
# Install rollup-plugin-visualizer
yarn add -D rollup-plugin-visualizer

# Update vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
    plugins: [
        visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
        })
    ]
})

# Build and view
yarn build
# Opens stats.html in browser
```

### 3. Web Vitals

```javascript
// Add web-vitals library
// yarn add web-vitals

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const sendToAnalytics = (metric) => {
    console.log(metric)
    // Send to analytics service
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## Checklist Before Deployment

### Pre-deployment

- [ ] Run `yarn build` successfully
- [ ] Test production build locally with `yarn preview`
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] Code minified
- [ ] CSS purged of unused styles

### Post-deployment

- [ ] All pages load correctly
- [ ] No 404 errors in console
- [ ] Static assets loading (images, fonts, icons)
- [ ] Forms working properly
- [ ] LocalStorage functionality working
- [ ] Responsive design working on all devices
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Lighthouse audit score > 90
- [ ] SEO meta tags present
- [ ] Analytics tracking working (if implemented)

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
yarn install
yarn build

# Check for dependency issues
yarn install --check-files

# Update dependencies
yarn upgrade-interactive --latest
```

### Deployment Issues

```bash
# Check build output
ls -la dist/

# Verify file sizes
du -sh dist/*

# Test locally
yarn preview

# Check server logs
# nginx: sudo tail -f /var/log/nginx/error.log
# apache: sudo tail -f /var/log/apache2/error.log
```

### Performance Issues

```bash
# Analyze bundle size
yarn build --mode production
du -sh dist/assets/*

# Check for large files
find dist -type f -size +500k -exec ls -lh {} \;

# Optimize images
# Use tools like imagemin, squoosh, or tinypng
```

## Rollback Strategy

```bash
# Keep previous builds
mv dist dist-backup-$(date +%Y%m%d-%H%M%S)

# If deployment fails, restore previous
rm -rf dist
mv dist-backup-YYYYMMDD-HHMMSS dist

# Git tags for releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Rollback to previous tag
git checkout v1.0.0
yarn install
yarn build
```

