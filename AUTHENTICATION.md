# Authentication System Documentation

## Overview
This is a complete authentication system for the Yena Photo app with sign-in/sign-up functionality and protected routes.

## Features
- ✅ User registration with email/password
- ✅ Secure login with password hashing (bcryptjs)
- ✅ Session management with HTTP-only cookies
- ✅ User context hook for accessing user data across the app
- ✅ Protected routes with automatic redirects
- ✅ Sign out functionality
- ✅ Integrated sidebar with user display and sign out button

## Architecture

### API Routes
- **POST /api/auth/signup** - Create a new user account
- **POST /api/auth/signin** - Login with email and password
- **POST /api/auth/signout** - Logout and clear session
- **GET /api/auth/session** - Get current user session

### Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### 1. Using the Auth Hook
Access user data and auth functions anywhere in your app:

```tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export function MyComponent() {
  const { user, isAuthenticated, signOut, error } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 2. Protecting Routes
All routes under `/dashboard` are automatically protected by the middleware. Unauthenticated users are redirected to `/signin`.

You can also manually protect routes using the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '@/components/protected-route';

export default function Page() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### 3. Sign In/Sign Up Pages
- **Sign Up**: `http://localhost:3000/signup`
- **Sign In**: `http://localhost:3000/signin`

Forms include validation and error handling.

## Flow

### Sign Up Flow
1. User submits email and password on `/signup`
2. API validates input and checks for duplicate email
3. Password is hashed using bcryptjs
4. User is created in database
5. Session cookie is set (7 days expiration)
6. User is redirected to `/dashboard`

### Sign In Flow
1. User submits email and password on `/signin`
2. API validates credentials
3. Password is compared with hashed password in database
4. If valid, session cookie is set
5. User is redirected to `/dashboard`

### Protected Route Access
1. User tries to access route under `/dashboard`
2. Middleware checks for `userId` cookie
3. If not found, user is redirected to `/signin`
4. `AuthProvider` fetches user session on app load
5. User data is available via `useAuth()` hook

## Key Files

### Core Files
- [lib/auth-service.ts](../lib/auth-service.ts) - Authentication service functions
- [hooks/use-auth.tsx](../hooks/use-auth.tsx) - User context and auth hook
- [middleware.ts](../middleware.ts) - Route protection middleware

### API Routes
- [app/api/auth/signup/route.ts](../app/api/auth/signup/route.ts) - Sign up endpoint
- [app/api/auth/signin/route.ts](../app/api/auth/signin/route.ts) - Sign in endpoint
- [app/api/auth/signout/route.ts](../app/api/auth/signout/route.ts) - Sign out endpoint
- [app/api/auth/session/route.ts](../app/api/auth/session/route.ts) - Session check endpoint

### Pages
- [app/signup/page.tsx](../app/signup/page.tsx) - Sign up page
- [app/signin/page.tsx](../app/signin/page.tsx) - Sign in page

### Components
- [components/protected-route.tsx](../components/protected-route.tsx) - Route protection wrapper
- [components/sidebar.tsx](../components/sidebar.tsx) - Updated with user display and sign out

## Security Features

1. **Password Hashing**: Passwords are hashed with bcryptjs (rounds: 10)
2. **HTTP-Only Cookies**: Session cookies cannot be accessed via JavaScript
3. **Secure Flag**: Cookies are marked as secure in production
4. **SameSite Policy**: Cookies use SameSite=Lax to prevent CSRF
5. **Input Validation**: Email and password are validated with Zod
6. **Middleware Protection**: Server-side route protection

## Environment Variables Required

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production # or development
```

## Dashboard Structure

All routes under `/dashboard` are protected:
- `/dashboard` - Main dashboard
- `/dashboard/events` - Events management
- `/dashboard/analytics` - Search analytics
- `/dashboard/settings` - User settings
- `/dashboard/find-photos` - Find your photos
- `/dashboard/search-results` - Search results

These routes automatically use the `DashboardLayout` component which wraps the sidebar.

## Next Steps

You can extend this authentication system with:
- Email verification
- Password reset functionality
- OAuth providers (Google, GitHub, etc.)
- Two-factor authentication
- User profiles and settings
- Role-based access control (RBAC)

## Testing

1. Navigate to `/signup` and create an account
2. You'll be automatically redirected to `/dashboard`
3. Your email should display in the sidebar
4. Click "Sign Out" to logout
5. Try accessing `/dashboard` - you'll be redirected to `/signin`
