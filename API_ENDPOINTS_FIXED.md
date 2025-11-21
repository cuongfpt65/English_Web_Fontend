# API Configuration Fixed - Summary

## Vấn đề đã sửa

### 1. **Base URL mismatch**
- ❌ **Cũ**: `https://localhost:5019/api`
- ✅ **Mới**: `https://localhost:7023/api`

**Files đã sửa:**
- `src/services/api.ts` - Cập nhật base URL mặc định
- `.env` - Thêm VITE_API_URL configuration
- `.env.example` - Template cho developers

### 2. **Authentication Endpoints Fixed**

#### Send Verification Code
- ❌ **Frontend cũ**: `/Auth/send-verification-code`
- ✅ **Backend thực tế**: `/auth/send-code`
- ✅ **Fixed in**: `src/services/authService.ts`

#### Phone Authentication
- ❌ **Frontend cũ**: `/auth/verify-phone-login`
- ✅ **Backend thực tế**: `/auth/phone-auth`
- ✅ **Fixed in**: `src/services/authService.ts`

## API Endpoints - Correct URLs

### Auth Endpoints (Backend: `AuthController_Clean.cs`)

```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/send-code          // ✅ Fixed from send-verification-code
POST /api/auth/phone-auth          // ✅ Fixed from verify-phone-login
```

### Vocabulary Endpoints

```typescript
GET    /api/vocabulary
GET    /api/vocabulary/topics
GET    /api/vocabulary/levels
GET    /api/vocabulary/my-vocabulary
POST   /api/vocabulary/{id}/toggle-learned
POST   /api/vocabulary/{id}/note
POST   /api/vocabulary
DELETE /api/vocabulary/{id}
```

### Class Endpoints

```typescript
GET    /api/class                     // Get user's classes
GET    /api/class/{id}               // Get class details
GET    /api/class/{id}/members       // Get class members
POST   /api/class                     // Create class
POST   /api/class/join               // Join class by code
DELETE /api/class/{id}/leave         // Leave class
GET    /api/class/{id}/ranking       // Get class ranking
```

### Class Chat Endpoints

```typescript
GET    /api/classchat/{classId}/messages
POST   /api/classchat/{classId}/messages
DELETE /api/classchat/messages/{messageId}
```

### Class Quiz Endpoints

```typescript
GET    /api/classquiz/{classId}                    // Get all quizzes
POST   /api/classquiz/{classId}                    // Create quiz
GET    /api/classquiz/{quizId}/start               // Start quiz
POST   /api/classquiz/{quizId}/submit              // Submit answers
GET    /api/classquiz/{quizId}/results             // Get results
DELETE /api/classquiz/{quizId}                     // Delete quiz
```

### Chat Endpoints

```typescript
GET    /api/chat/sessions
POST   /api/chat/sessions
GET    /api/chat/sessions/{sessionId}/messages
POST   /api/chat/sessions/{sessionId}/messages
```

## Environment Configuration

### Development (.env)
```env
VITE_API_URL=https://localhost:7023/api
VITE_ENV=development
```

### Production (Update as needed)
```env
VITE_API_URL=https://your-production-api.com/api
VITE_ENV=production
```

## Migration Steps for Developers

1. **Pull latest code**
2. **Copy `.env.example` to `.env`**
   ```bash
   cp .env.example .env
   ```
3. **Update `.env` if needed** (default values should work)
4. **Restart frontend dev server**
   ```bash
   npm run dev
   ```
5. **Ensure backend is running on port 7023**

## Checklist ✅

- [x] Updated base URL in `api.ts`
- [x] Fixed `/auth/send-code` endpoint
- [x] Fixed `/auth/phone-auth` endpoint  
- [x] Created `.env` file with correct configuration
- [x] Created `.env.example` template
- [x] Updated `.gitignore` to exclude `.env`
- [x] Documented all API endpoints

## Testing

After these changes, test the following flows:

1. **Login with Email/Password** ✅
   ```
   POST /api/auth/login
   ```

2. **Register new account** ✅
   ```
   POST /api/auth/register
   ```

3. **Phone Authentication Flow** ✅
   ```
   1. POST /api/auth/send-code
   2. POST /api/auth/phone-auth
   ```

4. **Vocabulary Operations** ✅
   ```
   GET /api/vocabulary
   POST /api/vocabulary/{id}/toggle-learned
   ```

5. **Class Features** ✅
   ```
   GET /api/class
   POST /api/class/join
   GET /api/classchat/{classId}/messages
   ```

## Notes

- ✅ All endpoints use lowercase for consistency
- ✅ Base URL includes `/api` prefix
- ✅ CORS configured for `localhost:5173` and `localhost:5174`
- ✅ JWT Bearer token authentication
- ✅ Swagger available at `https://localhost:7023/swagger`

## Status: ✅ FIXED

All API endpoint mismatches have been resolved. Frontend now correctly communicates with backend on port 7023.
