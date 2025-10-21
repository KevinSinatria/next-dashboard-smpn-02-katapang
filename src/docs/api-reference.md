# API Reference

## Overview

The frontend communicates with an Express.js backend API through HTTP requests. All API calls are proxied through Next.js configuration for development and point directly to the production API in production.

## API Configuration

### Base URL Configuration
```typescript
// src/lib/apiClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? BASE_URL : "/api",
  withCredentials: true, // Include cookies for authentication
})
```

### API Proxy (Development)
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

## Authentication Endpoints

### POST /auth/login
**Purpose**: User authentication
**Access**: Public

**Request Body**:
```typescript
{
  username: string
  password: string
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
  data: {
    access_token: string
    user: {
      id: number
      username: string
      role: string[]
    }
  }
}
```

### GET /auth/me
**Purpose**: Get current user information
**Access**: Authenticated users
**Authentication**: Cookie-based

**Response**:
```typescript
{
  success: boolean
  data: {
    id: number
    username: string
    role: string[]
  }
}
```

### POST /auth/logout
**Purpose**: User logout
**Access**: Authenticated users
**Authentication**: Cookie-based

## Personnel Management

### GET /personnel
**Purpose**: Get all personnel with pagination
**Access**: Admin, Super Admin
**Query Parameters**:
- `page?: number` (default: 1)
- `limit?: number` (default: 10)
- `search?: string`

### POST /personnel
**Purpose**: Create new personnel
**Access**: Admin, Super Admin
**Content-Type**: `multipart/form-data`

**Request Body**:
```typescript
{
  name: string
  active: boolean
  image: File
}
```

### GET /personnel/{id}
**Purpose**: Get personnel by ID
**Access**: Admin, Super Admin

### PUT /personnel/{id}
**Purpose**: Update personnel
**Access**: Admin, Super Admin
**Content-Type**: `multipart/form-data`

### DELETE /personnel/{id}
**Purpose**: Delete personnel
**Access**: Admin, Super Admin

## Role Management

### GET /roles
**Purpose**: Get all roles with pagination
**Access**: Admin, Super Admin
**Query Parameters**:
- `page?: number`
- `limit?: number`
- `search?: string`

### POST /roles
**Purpose**: Create new role
**Access**: Admin, Super Admin

**Request Body**:
```typescript
{
  name: string
}
```

### PUT /roles/{id}
**Purpose**: Update role
**Access**: Admin, Super Admin

### DELETE /roles/{id}
**Purpose**: Delete role
**Access**: Admin, Super Admin

## Article Management

### GET /articles
**Purpose**: Get published articles (public)
**Access**: Public
**Query Parameters**:
- `page?: number`
- `limit?: number`

### GET /articles/for-admin
**Purpose**: Get all articles for admin
**Access**: Admin, Super Admin, Humas, PKS Humas
**Query Parameters**:
- `page?: number`
- `limit?: number`
- `search?: string`

### POST /articles
**Purpose**: Create new article
**Access**: Admin, Super Admin, Humas, PKS Humas
**Content-Type**: `multipart/form-data`

**Request Body**:
```typescript
{
  title: string
  content: string (JSON)
  category_id: number
  author_id: number
  published: boolean
  image: File
}
```

### GET /articles/{slug}
**Purpose**: Get article by slug
**Access**: Public (published) / Authenticated (all)

### PUT /articles/{slug}
**Purpose**: Update article
**Access**: Admin, Super Admin, Humas, PKS Humas
**Content-Type**: `multipart/form-data`

### DELETE /articles/{slug}
**Purpose**: Delete article
**Access**: Admin, Super Admin, Humas, PKS Humas

### POST /articles/image
**Purpose**: Upload image for article content
**Access**: Authenticated
**Content-Type**: `multipart/form-data`

## Article Categories

### GET /article-categories
**Purpose**: Get all article categories
**Access**: Admin, Super Admin, Humas, PKS Humas

### POST /article-categories
**Purpose**: Create new category
**Access**: Admin, Super Admin, Humas, PKS Humas

**Request Body**:
```typescript
{
  name: string
}
```

### PUT /article-categories/{id}
**Purpose**: Update category
**Access**: Admin, Super Admin, Humas, PKS Humas

### DELETE /article-categories/{id}
**Purpose**: Delete category
**Access**: Admin, Super Admin, Humas, PKS Humas

## Gallery Albums

### GET /gallery-albums
**Purpose**: Get all gallery albums
**Access**: Public
**Query Parameters**:
- `page?: number`
- `limit?: number`
- `search?: string`

### POST /gallery-albums
**Purpose**: Create new gallery album
**Access**: Admin, Super Admin, Humas, PKS Humas

**Request Body**:
```typescript
{
  name: string
  description: string
}
```

### GET /gallery-albums/{slug}
**Purpose**: Get gallery album by slug
**Access**: Public

### PUT /gallery-albums/{id}
**Purpose**: Update gallery album
**Access**: Admin, Super Admin, Humas, PKS Humas

### DELETE /gallery-albums/{id}
**Purpose**: Delete gallery album
**Access**: Admin, Super Admin, Humas, PKS Humas

### PUT /gallery-albums/{id}/photos
**Purpose**: Update photos in gallery album
**Access**: Admin, Super Admin, Humas, PKS Humas
**Content-Type**: `multipart/form-data`

**Request Body**:
```typescript
{
  images: File[]
  deleted_photo_ids?: string (JSON array)
}
```

## Headmaster Management

### GET /headmasters
**Purpose**: Get all headmasters
**Access**: Admin, Super Admin

### POST /headmasters
**Purpose**: Create new headmaster
**Access**: Admin, Super Admin

**Request Body**:
```typescript
{
  personnel_id: number
  start_year: number
  end_year: number
  is_active: boolean
  welcoming_sentence: object (EditorJS format)
}
```

### GET /headmasters/current
**Purpose**: Get current active headmaster
**Access**: Public

### PUT /headmasters/{id}
**Purpose**: Update headmaster
**Access**: Admin, Super Admin

### DELETE /headmasters/{id}
**Purpose**: Delete headmaster
**Access**: Admin, Super Admin

## School Information

### GET /school-informations
**Purpose**: Get school information
**Access**: Public

### PUT /school-informations
**Purpose**: Update school information
**Access**: Admin, Super Admin, Humas, PKS Humas

**Request Body**:
```typescript
{
  email?: string
  phone?: string
  vision?: string
  missions?: string
  address?: string
  map_url?: string
  instagram?: string
}
```

## School Statistics

### GET /school-stats
**Purpose**: Get school statistics
**Access**: Admin, Super Admin

### POST /school-stats
**Purpose**: Create new school statistics
**Access**: Admin, Super Admin

**Request Body**:
```typescript
{
  year: number
  students: number
  classes: number
  teachers: number
}
```

### PUT /school-stats/{id}
**Purpose**: Update school statistics
**Access**: Admin, Super Admin

### DELETE /school-stats/{id}
**Purpose**: Delete school statistics
**Access**: Admin, Super Admin

## School Events

### GET /school-events
**Purpose**: Get school events
**Access**: Public
**Query Parameters**:
- `start?: string` (date)
- `end?: string` (date)

### POST /school-events
**Purpose**: Create new school event
**Access**: Admin, Super Admin, Humas, PKS Humas

**Request Body**:
```typescript
{
  title: string
  description: string
  start_date: string (YYYY-MM-DD)
  end_date: string (YYYY-MM-DD)
}
```

### PUT /school-events/{id}
**Purpose**: Update school event
**Access**: Admin, Super Admin, Humas, PKS Humas

### DELETE /school-events/{id}
**Purpose**: Delete school event
**Access**: Admin, Super Admin, Humas, PKS Humas

## User Management

### GET /users
**Purpose**: Get all users
**Access**: Admin, Super Admin

### POST /users
**Purpose**: Create new user
**Access**: Admin, Super Admin

**Request Body**:
```typescript
{
  username: string
  password: string
  personnel_id: number
}
```

### PUT /users/{id}
**Purpose**: Update user
**Access**: Admin, Super Admin

### DELETE /users/{id}
**Purpose**: Delete user
**Access**: Admin, Super Admin

## Error Responses

All endpoints may return error responses in the following format:

```typescript
{
  success: false
  message: string
  errors?: object // Validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Authentication & Authorization

### Cookie-based Authentication
- Authentication uses HTTP-only cookies
- Cookies are automatically included in requests with `withCredentials: true`
- No manual token management required

### Role-based Access Control
Roles hierarchy:
- **Super Admin** - Full access to all features
- **Admin** - Access to most management features
- **Humas** - Content management (articles, gallery, events)
- **PKS Humas** - Content management (articles, gallery, events)

### Protected Endpoints
Most management endpoints require authentication and specific roles. Public endpoints include:
- Article listing and details
- Gallery albums
- School information
- Current headmaster
- School events