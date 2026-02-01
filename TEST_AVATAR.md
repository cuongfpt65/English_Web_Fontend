# 🔍 Avatar Debugging Guide

## Vấn đề
Avatar không hiển thị trong MainLayout sau khi upload trong ProfilePage.

## Nguyên nhân đã tìm thấy

### 1. ❌ Interface AuthResponse thiếu field avatarUrl
**File:** `src/services/authService.ts`

**Trước:**
```typescript
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        phoneNumber?: string;
        name: string;
        role?: string;
        status?: string;
    };
    token: string;
}
```

**Sau:**
```typescript
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        phoneNumber?: string;
        name: string;
        fullName?: string;    // ✅ Thêm mới
        avatarUrl?: string;   // ✅ Thêm mới
        role?: string;
        status?: string;
    };
    token: string;
}
```

**Giải thích:**
- Khi login, API trả về user object
- TypeScript interface không có `avatarUrl` nên bị bỏ qua
- Store không lưu avatarUrl ngay từ đầu

## Cách kiểm tra Avatar

### Bước 1: Kiểm tra Backend API Response

#### Test Login API
```bash
# Sử dụng curl hoặc Postman
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "cuongnccse171013@fpt.edu.vn",
    "password": "yourpassword"
  }'
```

**Kết quả mong đợi:**
```json
{
  "user": {
    "id": "...",
    "email": "cuongnccse171013@fpt.edu.vn",
    "name": "NGUYEN CHI",
    "fullName": "NGUYEN CHI",
    "avatarUrl": "https://res.cloudinary.com/...",  // ⭐ Phải có field này
    "role": "Student"
  },
  "token": "..."
}
```

#### Test Get Profile API
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Kết quả mong đợi:**
```json
{
  "id": "...",
  "email": "cuongnccse171013@fpt.edu.vn",
  "fullName": "NGUYEN CHI",
  "avatarUrl": "https://res.cloudinary.com/...",  // ⭐ Phải có
  "phoneNumber": "...",
  "role": "Student"
}
```

### Bước 2: Kiểm tra LocalStorage

**Mở Browser Console và chạy:**
```javascript
// Xem toàn bộ auth store
const authStore = JSON.parse(localStorage.getItem('auth-storage'));
console.log('Auth Store:', authStore);

// Kiểm tra user object
console.log('User:', authStore.state.user);

// Kiểm tra avatarUrl
console.log('Avatar URL:', authStore.state.user.avatarUrl);
```

**Kết quả mong đợi:**
```javascript
Auth Store: {
  state: {
    user: {
      id: "...",
      email: "cuongnccse171013@fpt.edu.vn",
      name: "NGUYEN CHI",
      avatarUrl: "https://res.cloudinary.com/..."  // ⭐ Phải có
    },
    token: "...",
    isAuthenticated: true
  }
}
```

### Bước 3: Kiểm tra Avatar URL có load được không

**Browser Console:**
```javascript
// Test load avatar
const avatarUrl = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/...';

const img = new Image();
img.onload = () => console.log('✅ Avatar loaded successfully!');
img.onerror = () => console.error('❌ Avatar failed to load!');
img.src = avatarUrl;
```

### Bước 4: Kiểm tra Component Re-render

**Thêm console.log vào MainLayout:**
```typescript
// Trong MainLayout component
React.useEffect(() => {
    console.log('👤 User changed:', user);
    console.log('🖼️ Avatar URL:', user?.avatarUrl);
}, [user]);
```

**Xem Console khi:**
1. Login → Phải log user với avatarUrl
2. Upload avatar → Phải log user với avatarUrl mới
3. Refresh page → Phải log user với avatarUrl từ localStorage

## Các trường hợp lỗi thường gặp

### ❌ Trường hợp 1: Backend không trả về avatarUrl

**Triệu chứng:**
- Login thành công
- LocalStorage không có avatarUrl
- Console log: `Avatar URL: undefined`

**Giải pháp:**
1. Kiểm tra Backend API Controller
2. Đảm bảo User model có field AvatarUrl
3. Đảm bảo DTO/Response có map avatarUrl

**Backend code cần kiểm tra:**
```csharp
// UserController.cs hoặc AuthController.cs
public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string FullName { get; set; }
    public string AvatarUrl { get; set; }  // ⭐ Phải có
    public string Role { get; set; }
}
```

### ❌ Trường hợp 2: Upload thành công nhưng MainLayout không update

**Triệu chứng:**
- ProfilePage hiển thị avatar
- MainLayout vẫn hiển thị chữ cái
- Console log: `Avatar URL: undefined` hoặc URL cũ

**Nguyên nhân:**
ProfilePage không gọi `updateUser()` sau khi upload

**Giải pháp:**
Kiểm tra ProfilePage có đoạn code này:
```typescript
const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... upload code ...
    
    try {
        const result = await profileService.updateAvatar(file);
        
        // ⭐ Phải có dòng này
        updateUser({ avatarUrl: result.avatarUrl });
    } catch (error) {
        // ...
    }
};
```

### ❌ Trường hợp 3: Avatar URL đúng nhưng không load

**Triệu chứng:**
- LocalStorage có avatarUrl
- Console không báo lỗi
- Ảnh không hiển thị

**Nguyên nhân:**
- CORS issue
- Avatar URL không hợp lệ
- Cloudinary authentication

**Giải pháp:**

1. **Kiểm tra CORS:**
```javascript
// Browser Console
fetch('https://res.cloudinary.com/YOUR_URL')
  .then(res => console.log('✅ CORS OK'))
  .catch(err => console.error('❌ CORS Error:', err));
```

2. **Kiểm tra URL:**
```javascript
// Paste URL vào browser address bar
// Phải thấy ảnh hiển thị
```

3. **Kiểm tra Network Tab:**
- Mở DevTools > Network
- Filter: Img
- Tìm request tới Cloudinary
- Xem status code (phải 200)

### ❌ Trường hợp 4: Avatar hiển thị sau upload nhưng mất sau refresh

**Triệu chứng:**
- Upload avatar → Hiển thị OK
- Refresh page → Mất avatar

**Nguyên nhân:**
Zustand persist không lưu avatarUrl

**Giải pháp:**
Kiểm tra store config có partialize đúng:
```typescript
{
    name: 'auth-store',
    partialize: (state) => ({
        user: state.user,  // ⭐ Phải persist toàn bộ user object
        token: state.token,
        isAuthenticated: state.isAuthenticated,
    }),
}
```

## Testing Checklist

### Frontend Testing
- [ ] Login → Check localStorage có avatarUrl
- [ ] Upload avatar → Check console log "User avatar URL: ..."
- [ ] Refresh page → Avatar vẫn hiển thị
- [ ] Collapse/Expand sidebar → Avatar hiển thị đúng
- [ ] Mobile view → Avatar hiển thị
- [ ] Profile button → Avatar hiển thị (khi collapsed)
- [ ] User info section → Avatar hiển thị (khi expanded)

### Backend Testing
- [ ] Login API trả về avatarUrl
- [ ] Get Profile API trả về avatarUrl
- [ ] Update Avatar API trả về URL mới
- [ ] Avatar URL accessible (không cần auth)

### Integration Testing
1. **Scenario 1: Fresh Login**
   - Logout hoàn toàn
   - Clear localStorage
   - Login lại
   - ✅ Avatar phải hiển thị (nếu đã có)

2. **Scenario 2: Upload Avatar**
   - Login
   - Vào Profile
   - Upload avatar
   - ✅ Avatar phải hiển thị trong sidebar ngay lập tức
   - Refresh page
   - ✅ Avatar vẫn hiển thị

3. **Scenario 3: Multiple Devices**
   - Upload avatar trên device A
   - Login vào device B
   - ✅ Avatar phải hiển thị trên device B

## Debug Commands

### Clear Cache và Test lại
```javascript
// Browser Console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Force re-login
```javascript
// Browser Console
localStorage.removeItem('auth-storage');
location.href = '/auth';
```

### Manually set avatar (for testing)
```javascript
// Browser Console
const authStore = JSON.parse(localStorage.getItem('auth-storage'));
authStore.state.user.avatarUrl = 'https://res.cloudinary.com/YOUR_TEST_URL';
localStorage.setItem('auth-storage', JSON.stringify(authStore));
location.reload();
```

## Tổng kết Fix

### ✅ Đã sửa:
1. **AuthResponse Interface** - Thêm `avatarUrl` và `fullName`
2. **MainLayout Avatar Display** - Thêm `overflow-hidden` và error handling
3. **Debug Logging** - Thêm useEffect để log avatar URL

### 🔄 Cần kiểm tra tiếp:
1. **Backend API** - Đảm bảo trả về avatarUrl
2. **Database** - Đảm bảo AvatarUrl field tồn tại và có data
3. **ProfilePage** - Đảm bảo gọi updateUser() sau upload

### 📝 Next Steps:
1. Test login với account đã có avatar
2. Test upload avatar mới
3. Test refresh page
4. Kiểm tra Network tab để xem avatar request

---

**Created:** 2026-01-29  
**Status:** ✅ Interface Fixed - Needs Backend Verification
