# Hướng dẫn Authentication

## Các thay đổi đã thực hiện

### 1. **AuthContext.tsx** - Context API cho Authentication
- ✅ Đã thêm đầy đủ logic đăng nhập và đăng ký
- ✅ Tích hợp với `authService` để gọi API backend
- ✅ Tự động chuyển hướng đến trang chủ (`/`) sau khi đăng nhập/đăng ký thành công
- ✅ Lưu token và user vào localStorage
- ✅ Tự động load user từ localStorage khi khởi động app
- ✅ Chuyển hướng đến `/auth` khi logout

### 2. **store/index.ts** - Zustand Store cho Authentication
- ✅ Đã thêm navigation function vào các action login, register, loginWithPhone
- ✅ Tự động chuyển hướng đến trang chủ sau khi authentication thành công
- ✅ Export `setNavigate` function để thiết lập navigation từ component

### 3. **AuthPage.tsx** - Trang đăng nhập/đăng ký
- ✅ Đã thêm `useNavigate` hook
- ✅ Thiết lập navigation function cho store khi component mount
- ✅ Hỗ trợ đăng nhập bằng email/password hoặc số điện thoại

### 4. **routes/index.tsx** - Routing configuration
- ✅ Đã thêm `PublicRoute` component để ngăn user đã đăng nhập truy cập trang auth
- ✅ `ProtectedRoute` đã có sẵn để bảo vệ các route cần authentication

## Cách hoạt động

### Flow đăng nhập thành công:
1. User nhập thông tin đăng nhập trong `AuthPage`
2. Gọi `login()` hoặc `loginWithPhone()` từ `useAuthStore`
3. API call được thực hiện qua `authService`
4. Nếu thành công:
   - Token và user được lưu vào Zustand store
   - Token và user được persist vào localStorage
   - Tự động redirect đến trang chủ `/`
5. Nếu thất bại: hiển thị thông báo lỗi

### Flow khi load app:
1. Zustand middleware đọc dữ liệu từ localStorage
2. Nếu có token và user → `isAuthenticated = true`
3. Nếu không → `isAuthenticated = false`

### Protected Routes:
- Các route được bọc trong `<ProtectedRoute>` sẽ kiểm tra `isAuthenticated`
- Nếu chưa đăng nhập → redirect đến `/auth`
- Nếu đã đăng nhập → hiển thị nội dung

### Public Routes:
- Route `/auth` được bọc trong `<PublicRoute>`
- Nếu đã đăng nhập → redirect đến `/`
- Nếu chưa đăng nhập → hiển thị trang auth

## API Integration

File `services/api.ts` đã được cấu hình:
- ✅ Tự động thêm Bearer token vào headers của mọi request
- ✅ Xử lý lỗi 401 (Unauthorized) → tự động logout và redirect đến `/auth`

## Testing

Để test chức năng:

1. **Test đăng nhập thành công:**
   ```
   - Truy cập /auth
   - Nhập thông tin đúng
   - Sau khi submit → tự động chuyển đến /
   ```

2. **Test đăng ký thành công:**
   ```
   - Truy cập /auth
   - Chuyển sang tab "Tạo tài khoản"
   - Nhập thông tin
   - Sau khi submit → tự động chuyển đến /
   ```

3. **Test Protected Route:**
   ```
   - Chưa đăng nhập → truy cập /vocabulary
   - Tự động redirect đến /auth
   ```

4. **Test Public Route:**
   ```
   - Đã đăng nhập → truy cập /auth
   - Tự động redirect đến /
   ```

5. **Test Logout:**
   ```
   - Click nút Logout
   - Tự động redirect đến /auth
   ```

## Notes

- Store sử dụng Zustand với persist middleware
- Context API cũng có sẵn nếu muốn sử dụng thay cho Zustand
- Token được lưu trong localStorage với key `auth-store`
- API base URL: `https://localhost:5019/api` (có thể thay đổi trong `.env`)
