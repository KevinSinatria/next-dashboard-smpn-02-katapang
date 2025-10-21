# Components

## Component Architecture

The application uses a hierarchical component structure with reusable UI components, feature-specific components, and layout components.

## Layout Components

### DashboardLayout
**Location**: `src/components/layout/DashboardLayout.tsx`

Main layout wrapper for authenticated pages with sidebar navigation and header.

```typescript
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <HeaderProvider>
        <div className="flex max-h-screen overflow-y-hidden bg-gray-50">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <DynamicHeader />
            <div className="p-6 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </HeaderProvider>
    </ProtectedPage>
  )
}
```

**Features**:
- Responsive sidebar with mobile toggle
- Dynamic header with user dropdown
- Role-based navigation menu
- Protected route wrapper

### Sidebar
**Location**: `src/components/ui/Sidebar.tsx`

Navigation sidebar with role-based menu items and animations.

**Features**:
- Collapsible menu groups
- Role-based access control
- Framer Motion animations
- Mobile responsive design

## Common Components

### Breadcrumbs
**Location**: `src/components/common/Breadcrumbs.tsx`

Navigation breadcrumb component for page hierarchy.

```typescript
interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  // Renders breadcrumb navigation
}
```

### Pagination
**Location**: `src/components/common/Pagination.tsx`

Pagination component with page numbers and navigation controls.

```typescript
export const PaginationContainer = ({
  meta,
  handlePageChange,
}: {
  meta: Meta
  handlePageChange: (page: number) => void
}) => {
  // Uses usePagination hook for page calculation
}
```

### ImageDropzone
**Location**: `src/components/common/ImageDropzone.tsx`

Single file upload component with drag-and-drop support.

**Features**:
- Drag and drop file upload
- Image preview
- File validation (size, type)
- Remove functionality
- Read-only mode support

```typescript
interface ImageDropzoneProps {
  onChange: (file: File | null) => void
  className?: string
  initialPreviewUrl?: string | null
  readOnly?: boolean
}
```

### MultiImageDropzone
**Location**: `src/components/common/MultiDropzone.tsx`

Multiple file upload component for gallery management.

**Features**:
- Multiple file selection
- Grid layout preview
- Individual file removal
- Existing image management
- Maximum file limit

```typescript
export type ImageItem = {
  file?: File
  url: string
  id?: number
}
```

### EditorComponent
**Location**: `src/components/common/EditorComponent.tsx`

Rich text editor wrapper using EditorJS.

**Features**:
- Block-style editing
- Multiple content blocks (header, paragraph, list, etc.)
- Image upload integration
- Full-feature and basic modes

```typescript
interface EditorProps {
  data?: OutputData
  onChange: (data: OutputData) => void
  holder: string
  fullFeature?: boolean
}
```

## UI Components (shadcn/ui)

### Form Components
**Location**: `src/components/ui/`

- **Button** - Various button styles and sizes
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection component
- **Switch** - Toggle switch component
- **Calendar** - Date picker component

### Layout Components
- **Card** - Content container with header/footer
- **Dialog** - Modal dialog component
- **Popover** - Floating content container
- **Dropdown Menu** - Context menu component

### Data Display
- **Table** - Data table with sorting and pagination
- **Badge** - Status and category indicators
- **Alert Dialog** - Confirmation dialogs

### Navigation
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation controls

## Feature Components

### Article Management
**Location**: `src/features/articles/components/`

- **ArticleForm** - Create/edit article form with rich text editor
- **ArticlesDataTable** - Article listing with search and pagination

### Personnel Management
**Location**: `src/features/personnels/components/`

- **PersonnelForm** - Personnel creation/editing form
- **PersonnelsDataTable** - Personnel listing and management

### Gallery Management
**Location**: `src/features/gallery-albums/components/`

- **GalleryAlbumForm** - Album creation with multiple image upload
- **GalleryAlbumsDataTable** - Album listing and management

### Authentication
**Location**: `src/features/auth/components/`

- **LoginForm** - User authentication form
- **ProtectedPage** - Route protection wrapper

## Rich Text Editor Components

### TipTap Components
**Location**: `src/components/tiptap-*/`

Advanced rich text editing components:
- **SimpleEditor** - Basic text editor
- **Node Components** - Custom editor nodes (blockquote, code-block, etc.)
- **UI Primitives** - Editor toolbar and controls

## Styling System

### Tailwind CSS Configuration
**Location**: `src/styles/globals.css`

- Custom CSS variables for theming
- Dark mode support
- Component-specific styles
- Animation utilities

### SCSS Modules
**Location**: `src/styles/`

- **main.scss** - Imports all component styles
- **_variables.scss** - CSS custom properties
- **_keyframe-animations.scss** - Animation definitions

## Component Patterns

### 1. Form Components
```typescript
// Standard form component pattern
export function ComponentForm({ initialData, readOnly }: FormProps) {
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: initialData || defaultValues
  })
  
  const onSubmit = async (data: FormType) => {
    // API call and error handling
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

### 2. Data Table Components
```typescript
// Standard data table pattern
export function ComponentDataTable() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchDebounced] = useDebounce(searchTerm, 500)
  
  const { data, isLoading, mutate } = useCustomHook({
    page,
    search: searchDebounced
  })
  
  return (
    <>
      {/* Search and controls */}
      <Table>
        {/* Table content */}
      </Table>
      <PaginationContainer />
    </>
  )
}
```

### 3. Modal/Dialog Pattern
```typescript
// Dialog component pattern
export function ComponentDialog({ isOpen, onClose, onSuccess, initialData }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ComponentForm 
          initialData={initialData}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
```

## Component Dependencies

### External Libraries
- **@radix-ui/react-*** - Headless UI primitives
- **framer-motion** - Animation library
- **lucide-react** - Icon components
- **react-hook-form** - Form management
- **react-dropzone** - File upload
- **sonner** - Toast notifications

### Internal Dependencies
- **Custom hooks** - Data fetching and state management
- **Type definitions** - TypeScript interfaces
- **Utility functions** - Helper functions and validation
- **API clients** - HTTP request handling

This component architecture provides a scalable, maintainable, and reusable foundation for the school management dashboard.