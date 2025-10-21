# Development Guide

## Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn** package manager
- **Git** for version control

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd next-dashboard-smpn-02-katapang
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.smpn2katapang.sch.id
NEXT_PUBLIC_NODE_ENV=development

# Optional: For HTTPS development
NODE_EXTRA_CA_CERTS=/path/to/rootCA.pem
```

**Environment Variables Explained**:
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_NODE_ENV` - Environment mode (development/production)
- `NODE_EXTRA_CA_CERTS` - SSL certificate path for HTTPS development

### 4. Development Server

#### Standard Development
```bash
npm run dev
# or
yarn dev
```
Runs on `http://localhost:3000`

#### HTTPS Development (Optional)
```bash
npm run dev:https
# or
yarn dev:https
```
Runs on `https://localhost:3000` with SSL certificates

#### Turbopack (Faster Development)
Both dev commands use Turbopack for faster builds:
```bash
next dev --turbopack
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run dev:https    # Start development server with HTTPS
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Project Configuration

### Next.js Configuration
**File**: `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@uiw/react-md-editor',
    '@uiw/react-markdown-preview',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.smpn2katapang.sch.id/:path*",
      },
    ];
  },
}
```

### TypeScript Configuration
**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind CSS Configuration
**File**: `postcss.config.mjs`

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
```

### ESLint Configuration
**File**: `eslint.config.mjs`

```javascript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature
```

### 2. Code Structure Guidelines

#### Component Creation
```typescript
// src/components/common/NewComponent.tsx
interface NewComponentProps {
  // Define props with TypeScript
}

export function NewComponent({ ...props }: NewComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
```

#### Custom Hook Creation
```typescript
// src/hooks/useCustomHook.ts
export function useCustomHook(params?: QueryParams) {
  const { data, error, isLoading, mutate } = useSWR(key, fetcher)
  
  return {
    data: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate
  }
}
```

#### API Service Creation
```typescript
// src/services/newService.ts
export const newService = {
  getAll: (params?: QueryParams) => apiClient.get('/endpoint', { params }),
  getById: (id: number) => apiClient.get(`/endpoint/${id}`),
  create: (data: CreateType) => apiClient.post('/endpoint', data),
  update: (id: number, data: UpdateType) => apiClient.put(`/endpoint/${id}`, data),
  delete: (id: number) => apiClient.delete(`/endpoint/${id}`)
}
```

### 3. Adding New Features

#### Step 1: Create Feature Structure
```bash
mkdir -p src/features/new-feature/{components,hooks,types}
touch src/features/new-feature/types.ts
```

#### Step 2: Define Types
```typescript
// src/features/new-feature/types.ts
export interface NewFeatureType {
  id: number
  name: string
  // ... other properties
}
```

#### Step 3: Create Custom Hook
```typescript
// src/features/new-feature/hooks/useNewFeature.ts
export function useNewFeatures(queryParams?: SWRHooksQueryParams) {
  // SWR implementation
}
```

#### Step 4: Create Components
```typescript
// src/features/new-feature/components/NewFeatureForm.tsx
// src/features/new-feature/components/NewFeaturesDataTable.tsx
```

#### Step 5: Create Pages
```typescript
// src/pages/dashboard/new-features/index.tsx
// src/pages/dashboard/new-features/new.tsx
// src/pages/dashboard/new-features/[id]/edit.tsx
```

## Common Development Tasks

### Adding New UI Components
```bash
# Using shadcn/ui CLI (if available)
npx shadcn-ui@latest add button

# Manual component creation
touch src/components/ui/new-component.tsx
```

### Adding New Dependencies
```bash
# Install runtime dependency
npm install package-name

# Install development dependency
npm install -D package-name

# Update package.json and commit
git add package.json package-lock.json
git commit -m "deps: add package-name"
```

### Environment-Specific Configuration

#### Development
- API calls proxied through Next.js
- Hot reloading enabled
- Source maps available
- Detailed error messages

#### Production
- Direct API calls to production server
- Optimized builds
- Minified code
- Error boundaries

## Debugging

### Browser DevTools
- React Developer Tools
- Network tab for API calls
- Console for error messages
- Application tab for cookies/storage

### Common Issues & Solutions

#### 1. CORS Issues
```typescript
// Ensure withCredentials is set
const apiClient = axios.create({
  withCredentials: true
})
```

#### 2. Authentication Issues
```typescript
// Check cookie settings in browser
// Verify API endpoint accessibility
// Check network requests in DevTools
```

#### 3. Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm update @types/*
```

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### 2. Image Optimization
- Use Next.js Image component
- Configure remote patterns in next.config.ts
- Optimize image formats (WebP, AVIF)

### 3. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic)
- Component-level lazy loading

## Testing

### Unit Testing (Future)
```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Testing (Future)
```bash
# Install Playwright or Cypress
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e
```

## Deployment

### Build Process
```bash
# Create production build
npm run build

# Test production build locally
npm run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://api.smpn2katapang.sch.id
NEXT_PUBLIC_NODE_ENV=production
```

### Static Export (if needed)
```bash
# Configure in next.config.ts
output: 'export'

# Build static files
npm run build
```

This development guide provides everything needed to set up, develop, and maintain the SMPN 02 Katapang dashboard application.