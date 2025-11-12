# 📝 Class Quiz Feature - Hướng Dẫn Sử Dụng

## Tổng Quan

Tính năng Quiz trong Class cho phép giáo viên tạo bài kiểm tra từ vựng và học sinh tham gia làm bài, với hệ thống xếp hạng tự động.

## 🎯 Tính Năng Chính

### 1. **Tạo Quiz (Dành cho Giáo Viên)**
- ✅ Chọn từ vựng từ thư viện hệ thống
- ✅ Tự động tạo câu hỏi với 3 loại:
  - **Multiple Choice**: Chọn nghĩa đúng của từ
  - **Fill in the Blank**: Điền từ vào chỗ trống
  - **Translation**: Dịch từ tiếng Anh sang tiếng Việt
- ✅ Cài đặt thời gian làm bài (1-120 phút)
- ✅ Đặt deadline cho quiz (tùy chọn)
- ✅ Filter từ vựng theo Topic và Level

### 2. **Làm Quiz (Dành cho Học Sinh)**
- ✅ Giao diện làm bài trực quan với timer đếm ngược
- ✅ Điều hướng giữa các câu hỏi
- ✅ Hiển thị tiến độ trả lời
- ✅ Tự động submit khi hết thời gian
- ✅ Có thể làm lại nhiều lần để cải thiện điểm

### 3. **Xem Kết Quả & Ranking**
- ✅ Xếp hạng theo điểm cao nhất
- ✅ Hiển thị Top 3 với podium
- ✅ Thống kê chi tiết:
  - Điểm số và phần trăm
  - Số lần làm bài
  - Ngày đạt điểm tốt nhất
- ✅ So sánh với các học sinh khác trong lớp

## 📂 Cấu Trúc File

```
src/features/class/components/
├── CreateQuizModal.tsx        # Modal tạo quiz mới
├── QuizTakingView.tsx         # Màn hình làm quiz
├── QuizResultsView.tsx        # Hiển thị kết quả & ranking
├── ClassQuizzes.tsx           # Component chính quản lý quizzes
└── ClassRanking.tsx           # Bảng xếp hạng tổng thể
```

## 🔧 API Endpoints

### Backend (C# .NET)

```csharp
// Get all quizzes in a class
GET /api/ClassQuiz/{classId}

// Create new quiz (Teacher only)
POST /api/ClassQuiz/{classId}
Body: {
    title: string,
    description: string,
    timeLimit: number,
    dueDate: DateTime?,
    questions: [{
        vocabularyId: Guid,
        questionType: string,
        questionText: string,
        correctAnswer: string,
        options: string[]?,
        order: number
    }]
}

// Start quiz attempt
GET /api/ClassQuiz/{quizId}/start
Response: {
    attemptId: Guid,
    quiz: {...},
    questions: [...]
}

// Submit quiz
POST /api/ClassQuiz/attempts/{attemptId}/submit
Body: {
    answers: [{
        questionId: Guid,
        answer: string
    }]
}

// Get quiz results & ranking
GET /api/ClassQuiz/{quizId}/results
```

## 🎨 UI/UX Features

### Create Quiz Modal
1. **Step 1: Quiz Info**
   - Nhập tiêu đề, mô tả
   - Cài đặt thời gian và deadline
   - Chọn từ vựng từ thư viện
   - Filter và search từ vựng

2. **Step 2: Review Questions**
   - Xem trước các câu hỏi đã tạo
   - Có thể quay lại chỉnh sửa
   - Xác nhận và tạo quiz

### Quiz Taking View
- **Header**: 
  - Tên quiz và mô tả
  - Timer đếm ngược với màu đổi theo thời gian còn lại
  - Tiến độ hoàn thành
  
- **Question Card**:
  - Hiển thị loại câu hỏi
  - Options cho Multiple Choice
  - Text input cho Fill Blank và Translation
  - Vocabulary reference để gợi ý
  
- **Navigation**:
  - Previous/Next buttons
  - Question navigator grid
  - Màu sắc phân biệt: Đã trả lời (xanh lá), Đang làm (xanh dương), Chưa làm (xám)

### Results View
- **Top 3 Podium**: Hiển thị nổi bật 3 người đứng đầu
- **Full Ranking Table**: Danh sách đầy đủ với:
  - Rank và medal icons
  - Avatar và tên học sinh
  - Điểm số và phần trăm
  - Số lần làm bài
  - Ngày làm tốt nhất
- **Statistics**: Tổng số người tham gia, điểm trung bình, điểm cao nhất

## 🏆 Ranking System

### Quiz Ranking
Xếp hạng dựa trên:
1. **Primary**: Điểm số cao nhất (Best Score)
2. **Secondary**: Ngày đạt điểm tốt nhất (sớm hơn = cao hơn)
3. **Tertiary**: Số lần làm bài (ít hơn = tốt hơn)

### Class Ranking
Xếp hạng tổng thể dựa trên:
1. Số lượng từ vựng đã học
2. Điểm quiz cao nhất
3. Điểm trung bình các quiz

## 💾 Database Schema

```csharp
ClassQuiz
├── Id (Guid)
├── ClassRoomId (Guid)
├── CreatedById (Guid)
├── Title (string)
├── Description (string)
├── TimeLimit (int) // minutes
├── DueDate (DateTime?)
├── IsActive (bool)
└── CreatedAt (DateTime)

ClassQuizQuestion
├── Id (Guid)
├── QuizId (Guid)
├── VocabularyId (Guid)
├── QuestionType (string) // MultipleChoice, FillBlank, Translation
├── QuestionText (string)
├── CorrectAnswer (string)
├── Options (string[]?)
└── Order (int)

ClassQuizAttempt
├── Id (Guid)
├── QuizId (Guid)
├── UserId (Guid)
├── Score (int)
├── TotalQuestions (int)
├── StartedAt (DateTime)
├── CompletedAt (DateTime?)
└── IsCompleted (bool)

ClassQuizAnswer
├── Id (Guid)
├── AttemptId (Guid)
├── QuestionId (Guid)
├── UserAnswer (string)
└── IsCorrect (bool)
```

## 🚀 Cách Sử Dụng

### Tạo Quiz (Giáo Viên)

1. Vào tab "Quizzes" trong Class
2. Click "Create Quiz"
3. Điền thông tin quiz:
   ```
   - Title: "Weekly Vocabulary Quiz #1"
   - Description: "Test your knowledge on greetings and basic phrases"
   - Time Limit: 15 minutes
   - Due Date: (optional)
   ```
4. Chọn từ vựng:
   - Search hoặc filter theo Topic/Level
   - Click vào từ để chọn
   - Minimum: 1 từ
5. Click "Generate Questions" để xem câu hỏi
6. Review và click "Create Quiz"

### Làm Quiz (Học Sinh)

1. Vào tab "Quizzes" trong Class
2. Tìm quiz active
3. Click "Take Quiz" để bắt đầu
4. Trả lời câu hỏi:
   - Click vào option (Multiple Choice)
   - Nhập text (Fill Blank/Translation)
5. Dùng Previous/Next để di chuyển
6. Click "Submit Quiz" khi hoàn thành
7. Confirm và xem kết quả

### Xem Ranking

**Cách 1**: Click "View Results" trên từng quiz
**Cách 2**: Vào tab "Ranking" trong Class để xem tổng thể

## 🎯 Tips & Best Practices

### Dành cho Giáo Viên:
- ✅ Chọn từ vựng cùng Level để công bằng
- ✅ Đặt thời gian hợp lý: ~1 phút/câu
- ✅ Tạo quiz ngắn (10-15 câu) để tăng tương tác
- ✅ Đặt deadline để học sinh có động lực
- ✅ Review kết quả để điều chỉnh giáo án

### Dành cho Học Sinh:
- ✅ Đọc kỹ câu hỏi trước khi trả lời
- ✅ Dùng vocabulary reference nếu cần
- ✅ Quản lý thời gian tốt
- ✅ Làm lại để cải thiện điểm
- ✅ So sánh với bạn bè để học hỏi

## 🔒 Permissions

| Action | Student | Teacher |
|--------|---------|---------|
| View Quizzes | ✅ | ✅ |
| Take Quiz | ✅ | ✅ |
| View Results | ✅ | ✅ |
| Create Quiz | ❌ | ✅ |
| Delete Quiz | ❌ | ✅ |

## 🐛 Troubleshooting

### Quiz không start được?
- Kiểm tra xem quiz còn active không
- Kiểm tra deadline đã qua chưa
- Refresh trang và thử lại

### Timer không chạy?
- Kiểm tra JavaScript console
- Refresh trang
- Đảm bảo không có ad-blocker

### Không thấy ranking?
- Đảm bảo đã có người làm quiz
- Refresh dữ liệu
- Kiểm tra API connection

## 📊 Metrics & Analytics

Hệ thống tự động track:
- Số lượng quiz đã tạo
- Số người tham gia mỗi quiz
- Điểm trung bình của lớp
- Tỷ lệ hoàn thành
- Top performers
- Improvement trends

## 🔮 Future Enhancements

Các tính năng có thể phát triển thêm:
- [ ] Timer per question
- [ ] Randomize question order
- [ ] Add images to questions
- [ ] Export results to Excel
- [ ] Quiz templates
- [ ] Collaborative quizzes
- [ ] Leaderboard rewards
- [ ] Quiz analytics dashboard

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log
2. Xem API response
3. Report bug với screenshots
4. Contact: [Your Contact Info]

---

**Chúc bạn tạo và làm quiz vui vẻ! 🎉**
