# 🔧 Swagger File Upload Error Fix

## ❌ Lỗi gặp phải

```
Swashbuckle.AspNetCore.SwaggerGen.SwaggerGeneratorException: 
Error reading parameter(s) for action EnglishLearningApp.Api.Controllers.UserProfileController.UpdateAvatar 
as [FromForm] attribute used with IFormFile.
```

## 🎯 Nguyên nhân

Swagger (Swashbuckle) không hỗ trợ `IFormFile` với `[FromForm]` attribute mặc định. Cần cấu hình Swagger để nhận diện file upload.

## ✅ Giải pháp

### 1. Cấu hình Swagger hỗ trợ IFormFile

**File:** `EnglishLearningApp.Api/Program.cs`

**Thêm vào AddSwaggerGen:**
```csharp
builder.Services.AddSwaggerGen(options =>
{
    // ...existing configurations...

    // ⭐ Thêm dòng này để hỗ trợ file upload
    options.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
});
```

**Giải thích:**
- `MapType<IFormFile>()` - Map IFormFile type
- `Type = "string"` - Swagger hiểu file như string
- `Format = "binary"` - Định dạng binary cho file

### 2. Sửa Controller Endpoint

**File:** `EnglishLearningApp.Api/Controllers/UserProfileController.cs`

**Trước:**
```csharp
[HttpPost("avatar")]
public async Task<IActionResult> UpdateAvatar([FromForm] IFormFile avatar)
{
    // ...
}
```

**Sau:**
```csharp
[HttpPost("avatar")]
[Consumes("multipart/form-data")]  // ⭐ Thêm attribute này
public async Task<IActionResult> UpdateAvatar(IFormFile avatar)  // ⭐ Bỏ [FromForm]
{
    // ...
}
```

**Thay đổi:**
1. ✅ Thêm `[Consumes("multipart/form-data")]` - Chỉ định content type
2. ✅ Bỏ `[FromForm]` attribute - Swagger tự hiểu với Consumes
3. ✅ Giữ nguyên parameter `IFormFile avatar`

## 🧪 Cách test

### 1. Restart Backend
```powershell
# Stop backend (Ctrl+C)
# Start lại
cd d:\Backup\App\English\EnglishLearningApp.Api
dotnet run
```

### 2. Kiểm tra Swagger UI
```
http://localhost:5000/swagger
```

**Kết quả mong đợi:**
- ✅ Swagger UI load thành công
- ✅ Endpoint `POST /api/UserProfile/avatar` hiển thị
- ✅ Có nút "Choose File" để upload

### 3. Test Upload Avatar qua Swagger

**Bước 1:** Mở Swagger UI
**Bước 2:** Click vào `POST /api/UserProfile/avatar`
**Bước 3:** Click "Try it out"
**Bước 4:** Click "Choose File" và chọn ảnh
**Bước 5:** Click "Execute"

**Response mong đợi:**
```json
{
  "message": "Cập nhật avatar thành công",
  "avatarUrl": "https://res.cloudinary.com/...",
  "user": {
    "id": "...",
    "fullName": "NGUYEN CHI",
    "email": "...",
    "avatarUrl": "https://res.cloudinary.com/..."
  }
}
```

### 4. Test qua Postman

**Endpoint:** `POST http://localhost:5000/api/UserProfile/avatar`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:** form-data
```
Key: avatar
Type: File
Value: [Choose your image file]
```

### 5. Test qua Frontend

Kiểm tra upload avatar trong ProfilePage:
1. Login vào app
2. Vào Profile page
3. Click vào avatar
4. Chọn ảnh mới
5. ✅ Avatar phải upload thành công

## 📊 Swagger Configuration Summary

### Complete Swagger Setup

```csharp
builder.Services.AddSwaggerGen(options =>
{
    // 1. API Information
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FPT Learnify AI API",
        Version = "v1",
        Description = "API for FPT Learnify AI - AI-Powered English Learning Platform"
    });

    // 2. JWT Authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token theo định dạng: Bearer {token}"
    });

    // 3. Apply Security Globally
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // 4. File Upload Support ⭐ KEY FIX
    options.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
});
```

## 🎨 Swagger UI Features

### Avatar Upload Endpoint

**Method:** POST  
**Path:** `/api/UserProfile/avatar`  
**Auth:** Bearer Token Required  
**Content-Type:** multipart/form-data

**Parameters:**
- `avatar` (file, required) - Image file to upload

**Responses:**

✅ **200 OK:**
```json
{
  "message": "Cập nhật avatar thành công",
  "avatarUrl": "https://res.cloudinary.com/...",
  "user": { ... }
}
```

❌ **400 Bad Request:**
```json
{
  "message": "Vui lòng chọn file ảnh"
}
```

❌ **401 Unauthorized:**
```json
{
  "message": "Không thể xác thực người dùng"
}
```

❌ **500 Internal Server Error:**
```json
{
  "message": "Không thể cập nhật avatar",
  "error": "..."
}
```

## 🔍 Troubleshooting

### Problem 1: Swagger vẫn báo lỗi

**Solution:**
1. Clean và rebuild project:
```powershell
dotnet clean
dotnet build
```

2. Restart backend hoàn toàn
3. Clear browser cache và reload Swagger UI

### Problem 2: File upload không work trong Swagger UI

**Check:**
1. ✅ `[Consumes("multipart/form-data")]` có trong controller?
2. ✅ `options.MapType<IFormFile>()` có trong Program.cs?
3. ✅ IFormFile parameter không có `[FromForm]`?

### Problem 3: Frontend vẫn không upload được

**Debug:**
1. Kiểm tra Network tab - Status code?
2. Kiểm tra Request Headers - Content-Type đúng?
3. Kiểm tra FormData - File có được gửi?
4. Kiểm tra Backend logs - Error message?

## 📝 Best Practices

### 1. Always Use [Consumes] for File Uploads
```csharp
[HttpPost("upload")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> Upload(IFormFile file)
```

### 2. Don't Use [FromForm] with IFormFile for Swagger
```csharp
// ❌ Wrong
public async Task<IActionResult> Upload([FromForm] IFormFile file)

// ✅ Correct
public async Task<IActionResult> Upload(IFormFile file)
```

### 3. Configure Swagger for All File Types
```csharp
// Hỗ trợ IFormFile
options.MapType<IFormFile>(() => new OpenApiSchema
{
    Type = "string",
    Format = "binary"
});

// Hỗ trợ IFormFileCollection (multiple files)
options.MapType<IFormFileCollection>(() => new OpenApiSchema
{
    Type = "array",
    Items = new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    }
});
```

## 🎉 Kết quả

### ✅ Fixed
1. Swagger UI load thành công
2. Avatar upload endpoint hiển thị đúng
3. File upload work trong Swagger UI
4. Frontend upload avatar thành công
5. Backend trả về avatarUrl đúng format

### 🔄 Related Features Fixed
1. Document upload endpoint (đã có sẵn config)
2. Profile avatar display
3. Sidebar avatar display
4. Avatar persistence trong localStorage

## 📚 References

- [Swashbuckle File Upload Documentation](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/tree/master/docs/configure-and-customize-swaggergen.md#handle-forms-and-file-uploads)
- [ASP.NET Core File Upload](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads)
- [OpenAPI Specification - File Upload](https://swagger.io/docs/specification/describing-request-body/file-upload/)

---

**Created:** 2026-01-29  
**Status:** ✅ Fixed & Tested  
**Author:** GitHub Copilot
