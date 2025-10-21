# Architecture

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Breadcrumbs, Pagination, etc.)
│   ├── layout/         # Layout components (DashboardLayout)
│   ├── ui/             # shadcn/ui components
│   └── tiptap-*/       # Rich text editor components
├── contexts/           # React contexts
├── features/           # Feature-based modules
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Next.js pages (Pages Router)
├── services/           # API service functions
├── styles/             # Global styles and SCSS
└── types/              # TypeScript type definitions
```

## Core Architecture Patterns

### 1. Feature-Based Organization
Each feature is organized in its own directory under `src/features/`:

```
features/
├── auth/               # Authentication
├── articles/           # Article management
├── article-categories/ # Category management
├── gallery-albums/     # Gallery management
├── headmasters/        # Headmaster management
├── personnels/         # Personnel management
├── roles/              # Role management
├── school-events/      # Event management
├── school-information/ # School info management
├── school-stats/       # Statistics management
└── users/              # User management
```

Each feature contains:
- `components/` - Feature-specific components
- `hooks/` - Custom hooks for data fetching
- `types.ts` - TypeScript interfaces
- `services/` - API calls (some features)

### 2. Pages Router Structure
Using Next.js Pages Router with file-based routing:

```
pages/
├── _app.tsx           # App wrapper with providers
├── _document.tsx      # HTML document structure
├── index.tsx          # Root redirect to login
├── login/             # Login page
├── dashboard/         # Protected dashboard routes
│   ├── index.tsx      # Dashboard home
│   ├── roles/         # Role management pages
│   ├── articles/      # Article management pages
│   └── [feature]/     # Other feature pages
└── api/               # API routes (minimal usage)
```

### 3. Component Architecture

#### Layout Components
- `DashboardLayout` - Main dashboard wrapper with sidebar and header
- `Sidebar` - Navigation with role-based menu items
- `ProtectedPage` - Authentication wrapper

#### Common Components
- `Breadcrumbs` - Navigation breadcrumbs
- `Pagination` - Data table pagination
- `ImageDropzone` - File upload component
- `MultiDropzone` - Multiple file upload
- `EditorComponent` - Rich text editor wrapper

#### UI Components (shadcn/ui)
Pre-built components from shadcn/ui library:
- Forms, Buttons, Dialogs
- Tables, Cards, Badges
- Dropdowns, Selects, Inputs

### 4. State Management

#### Authentication Context
```typescript
// src/contexts/HeaderContext.tsx
const AuthContext = createContext<AuthContextType>()
```

#### Data Fetching with SWR
```typescript
// Custom hooks pattern
export function useArticles(queryParams?: SWRHooksQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher)
  return { articles: data?.data, meta: data?.meta, isLoading, error, mutate }
}
```

### 5. API Integration

#### HTTP Client Configuration
```typescript
// src/lib/apiClient.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? BASE_URL : "/api",
  withCredentials: true,
})
```

#### API Proxy Configuration
```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "https://api.smpn2katapang.sch.id/:path*",
    },
  ];
}
```

## Backend Integration

The frontend connects to an Express.js backend API with:
- Cookie-based authentication
- RESTful API endpoints
- File upload handling
- Role-based access control

## Key Design Decisions

1. **Pages Router over App Router** - Using stable Pages Router for production reliability
2. **Feature-based Architecture** - Organized by business domains rather than technical layers
3. **SWR for Data Fetching** - Provides caching, revalidation, and optimistic updates
4. **shadcn/ui Components** - Consistent design system with customizable components
5. **TypeScript Throughout** - Full type safety across the application
6. **Cookie Authentication** - Secure authentication with HTTP-only cookies