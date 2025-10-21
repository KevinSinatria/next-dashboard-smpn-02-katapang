# Data Flow

## Overview

The application follows a client-server architecture with the Next.js frontend communicating with an Express.js backend API. Data flows through several layers with caching, authentication, and real-time updates.

## Authentication Flow

### 1. Login Process
```
User Input → LoginForm → apiClient.post('/auth/login') → Backend Validation → Cookie Set → Redirect to Dashboard
```

### 2. Authentication Context
```typescript
// AuthContext manages global auth state
const AuthContext = createContext<AuthContextType>()

// Automatic token verification on app load
useEffect(() => {
  const verifyUser = async () => {
    try {
      const response = await apiClient.get("/auth/me")
      setUser(response.data.data)
    } catch {
      setUser(null)
    }
  }
  verifyUser()
}, [])
```

### 3. Protected Routes
```typescript
// ProtectedPage wrapper checks authentication
export default function ProtectedPage({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (!isLoading && !isAuthenticated) {
    router.push("/login")
  }
  
  return isAuthenticated ? children : null
}
```

## Data Fetching Architecture

### 1. SWR Pattern
All data fetching uses SWR for caching and revalidation:

```typescript
// Custom hook pattern
export function useArticles(queryParams?: SWRHooksQueryParams) {
  const params = new URLSearchParams()
  if (queryParams?.page) params.append("page", queryParams.page.toString())
  
  const swrKey = `/articles${queryString ? `?${queryString}` : ""}`
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher)
  
  return {
    articles: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate
  }
}
```

### 2. API Client Configuration
```typescript
// Axios instance with interceptors
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? BASE_URL : "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Include cookies for authentication
})
```

### 3. Data Flow Layers

```
UI Component → Custom Hook (SWR) → API Client (Axios) → Backend API → Database
     ↑                                                                      ↓
Cache/State ← SWR Cache ← HTTP Response ← JSON Response ← Query Result
```

## CRUD Operations Flow

### 1. Create Operation
```typescript
const onSubmit = async (data: FormType) => {
  try {
    await apiClient.post('/endpoint', formData)
    mutate() // Revalidate SWR cache
    toast.success("Data berhasil dibuat")
    router.push('/list-page')
  } catch (error) {
    toast.error("Gagal membuat data")
  }
}
```

### 2. Update Operation
```typescript
const handleUpdate = async (id: number, data: FormType) => {
  try {
    await apiClient.put(`/endpoint/${id}`, data)
    mutate() // Refresh cache
    toast.success("Data berhasil diperbarui")
  } catch (error) {
    toast.error("Gagal memperbarui data")
  }
}
```

### 3. Delete Operation
```typescript
const handleDelete = async (id: number) => {
  try {
    await apiClient.delete(`/endpoint/${id}`)
    mutate() // Remove from cache
    toast.success("Data berhasil dihapus")
  } catch (error) {
    toast.error("Gagal menghapus data")
  }
}
```

## File Upload Flow

### 1. Single File Upload
```typescript
// ImageDropzone component
const handleFileSelect = (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  
  await apiClient.post('/endpoint', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
```

### 2. Multiple File Upload
```typescript
// MultiImageDropzone component
const newFiles = images.filter(item => item.file)
newFiles.forEach(item => {
  formData.append('images', item.file!)
})
```

## Real-time Updates

### 1. Optimistic Updates
SWR provides optimistic updates for better UX:

```typescript
// Immediate UI update, then revalidate
mutate(optimisticData, false)
await apiCall()
mutate() // Revalidate with server data
```

### 2. Cache Invalidation
```typescript
// Global cache invalidation
mutate(key => typeof key === 'string' && key.startsWith('/articles'))

// Specific cache invalidation
mutate('/articles')
```

## Error Handling

### 1. API Error Handling
```typescript
try {
  const response = await apiClient.post('/endpoint', data)
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message)
  }
}
```

### 2. SWR Error Handling
```typescript
const { data, error, isLoading } = useSWR(key, fetcher)

if (error) {
  return <ErrorComponent message={error.message} />
}
```

## State Management Patterns

### 1. Server State (SWR)
- API data caching
- Background revalidation
- Optimistic updates

### 2. Client State (React State)
- Form state (React Hook Form)
- UI state (loading, modals)
- Local preferences

### 3. Global State (Context)
- Authentication state
- User preferences
- Theme settings

## Performance Optimizations

### 1. SWR Caching
- Automatic deduplication
- Background revalidation
- Stale-while-revalidate pattern

### 2. Pagination
- Server-side pagination
- Cached page results
- Optimized re-fetching

### 3. Debounced Search
```typescript
const [searchDebounced] = useDebounce(searchTerm, 500)
```

This architecture ensures efficient data flow, proper caching, and a responsive user experience while maintaining data consistency across the application.