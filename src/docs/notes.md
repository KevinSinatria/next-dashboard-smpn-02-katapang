# Developer Notes

## Project Status

### Current Implementation
- ✅ Authentication system with cookie-based sessions
- ✅ Role-based access control (Super Admin, Admin, Humas, PKS Humas)
- ✅ Personnel management with image upload
- ✅ Article management with rich text editor (EditorJS)
- ✅ Gallery album management with multiple image upload
- ✅ School information management
- ✅ Headmaster management
- ✅ School statistics and events
- ✅ User management system
- ✅ Responsive design with mobile support

### In Progress / TODO
- [ ] TipTap rich text editor integration (partially implemented)
- [ ] Advanced search and filtering
- [ ] Bulk operations for data management
- [ ] Export functionality (PDF, Excel)
- [ ] Email notifications
- [ ] Audit logging
- [ ] Advanced file management
- [ ] Multi-language support

## Known Issues

### 1. EditorJS Image Upload
**Issue**: Image upload in EditorJS requires backend endpoint configuration
**Location**: `src/components/common/EditorComponent.tsx`
**Workaround**: Currently configured for `/articles/image` endpoint

```typescript
image: {
  class: Image,
  config: {
    endpoints: {
      byFile: `${BASE_URL}/articles/image`,
    },
    field: "image",
  },
},
```

### 2. TipTap Editor Integration
**Issue**: TipTap components are partially implemented but not fully integrated
**Location**: `src/components/tiptap-*` directories
**Status**: Components exist but need integration with forms

### 3. HTTPS Development Setup
**Issue**: HTTPS development requires manual certificate setup
**Solution**: Use mkcert for local SSL certificates

```bash
# Install mkcert
brew install mkcert  # macOS
# or
choco install mkcert  # Windows

# Create certificates
mkcert -install
mkcert localhost
```

### 4. File Upload Size Limits
**Issue**: Large file uploads may fail
**Configuration**: Check both frontend and backend limits

```typescript
// Frontend validation
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

// Backend configuration needed
// Express: app.use(express.json({ limit: '10mb' }))
```

## Performance Considerations

### 1. Image Optimization
- Images are served from external sources (Google Drive, Cloudinary)
- Next.js Image component is configured for these domains
- Consider implementing image compression on upload

### 2. Bundle Size
- Current bundle includes multiple rich text editors
- Consider lazy loading heavy components
- Monitor bundle size with `@next/bundle-analyzer`

### 3. API Caching
- SWR provides client-side caching
- Consider implementing server-side caching for frequently accessed data
- Implement proper cache invalidation strategies

## Security Notes

### 1. Authentication
- Uses HTTP-only cookies for security
- No JWT tokens stored in localStorage
- CSRF protection should be implemented on backend

### 2. File Upload Security
- File type validation implemented on frontend
- Backend should validate file types and scan for malware
- Consider implementing file size limits on server

### 3. Role-Based Access
- Frontend role checking is implemented
- Backend must enforce role-based permissions
- Sensitive operations require server-side validation

## Deployment Notes

### Production Environment
- **Frontend**: Can be deployed to Vercel, Netlify, or static hosting
- **Backend**: Express.js API deployed separately
- **Database**: PostgreSQL with Prisma ORM (inferred from backend structure)

### Environment Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://api.smpn2katapang.sch.id
NEXT_PUBLIC_NODE_ENV=production

# Development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_NODE_ENV=development
```

### Build Configuration
```bash
# Standard build
npm run build

# Build with Turbopack (faster)
npm run build --turbo
```

### Plesk Deployment
For Plesk hosting:
1. Build the application locally
2. Upload the `.next` folder and other necessary files
3. Configure Node.js application in Plesk
4. Set environment variables in Plesk panel
5. Configure reverse proxy if needed

## Code Quality

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*` → `src/*`)
- All components should be properly typed

### ESLint Rules
- Next.js recommended rules
- TypeScript integration
- Custom rules can be added to `eslint.config.mjs`

### Code Formatting
- Consider adding Prettier for consistent formatting
- Configure pre-commit hooks with Husky

## Database Schema (Inferred)

Based on the frontend types, the backend likely uses these main entities:

```sql
-- Users and Authentication
users (id, username, password_hash, personnel_id, created_at, updated_at)
roles (id, name, created_at, updated_at)
user_roles (user_id, role_id)

-- Personnel Management
personnel (id, name, image_url, active, created_at, updated_at)
personnel_roles (id, personnel_id, role_id, subject, position)

-- Content Management
articles (id, title, slug, content, thumbnail_url, author_id, category_id, published, published_at, created_at, updated_at)
article_categories (id, name, created_at, updated_at)

-- Gallery
gallery_albums (id, name, slug, description, created_at, updated_at)
gallery_photos (id, album_id, photo_url, created_at, updated_at)

-- School Information
headmasters (id, personnel_id, start_year, end_year, is_active, welcoming_sentence)
school_informations (id, vision, missions, address, map_url, email, phone, instagram, created_at, updated_at)
school_stats (id, year, students, classes, teachers, created_at, updated_at)
school_events (id, title, description, start_date, end_date, created_at, updated_at)
```

## Future Enhancements

### 1. Advanced Features
- **Dashboard Analytics**: Charts and graphs for school statistics
- **Notification System**: Real-time notifications for important events
- **Backup System**: Automated data backup and restore
- **API Documentation**: Swagger/OpenAPI documentation
- **Mobile App**: React Native or PWA version

### 2. Technical Improvements
- **Testing**: Unit tests with Jest, E2E tests with Playwright
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Error tracking with Sentry, performance monitoring
- **SEO**: Meta tags, sitemap generation, structured data

### 3. User Experience
- **Dark Mode**: Complete dark theme implementation
- **Accessibility**: WCAG compliance, keyboard navigation
- **Internationalization**: Multi-language support
- **Offline Support**: PWA features, offline data access

## Troubleshooting

### Common Development Issues

1. **Module Resolution Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

2. **TypeScript Errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

3. **API Connection Issues**
   - Check network tab in browser DevTools
   - Verify API endpoint URLs
   - Check CORS configuration

4. **Authentication Issues**
   - Clear browser cookies
   - Check cookie settings in DevTools
   - Verify API authentication endpoints

### Production Issues

1. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check for missing environment variables

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check server logs for backend issues

## Contact & Support

- **Developer**: Kevin Sinatria
- **Repository**: [GitHub Repository URL]
- **API Documentation**: Available in Swagger format
- **Backend Repository**: [Express Backend Repository URL]

## Version History

- **v1.0.0** - Initial release with core features
- **Current** - Active development with ongoing improvements

This documentation should be updated as the project evolves and new features are added.