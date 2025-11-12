# 🎨 Design Guide - English Learning App

## 🌈 Color Palette

### Primary Colors (Orange-Pink Theme)
Màu chủ đạo dễ thương, tươi sáng phù hợp với học sinh:

```css
/* Orange Tones */
--orange-50: #fff7ed
--orange-400: #fb923c
--orange-500: #f97316
--orange-600: #ea580c

/* Pink Tones */
--pink-50: #fdf2f8
--pink-400: #f472b6
--pink-500: #ec4899
--pink-600: #db2777

/* Primary (Mixed) */
--primary-400: #ff8ba7
--primary-500: #ff6b8f
--primary-600: #ff4d7a

/* Peach Tones */
--peach-100: #ffe9dd
--peach-400: #ff8d5a
--peach-500: #ff6f2c
```

### Gradients
```css
/* Hero Gradient */
bg-gradient-to-br from-orange-400 via-pink-400 to-rose-500

/* Button Gradient */
bg-gradient-to-r from-orange-500 to-pink-600

/* Background Gradient */
bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50

/* Card Hover Gradient */
bg-gradient-to-br from-orange-200 to-pink-300
```

## 🎯 Layout Structure

### Sidebar Navigation (Left)
- **Width**: 
  - Expanded: `w-64` (256px)
  - Collapsed: `w-20` (80px)
- **Position**: Fixed left
- **Background**: White with subtle shadow
- **Borders**: Pink-tinted borders (`border-pink-100`)

### Main Content Area
- **Margin**: Adjusts based on sidebar state
  - Expanded: `ml-64`
  - Collapsed: `ml-20`
- **Background**: Gradient background `from-orange-50 via-pink-50 to-peach-50`
- **Padding**: `p-6`

### Components Spacing
- Cards: `rounded-2xl` or `rounded-3xl` for softer look
- Shadow: `shadow-lg` to `shadow-2xl` for depth
- Hover effects: `hover:shadow-xl hover:-translate-y-1` for playful interaction

## ✨ Design Principles

### 1. **Playful & Friendly**
- Use emojis extensively (📚, ✨, 🌟, 🎉, 🚀)
- Rounded corners everywhere (`rounded-2xl`, `rounded-3xl`)
- Soft shadows and hover animations

### 2. **Bright & Cheerful**
- Gradient backgrounds instead of solid colors
- Light, airy color palette
- White cards with colorful accents

### 3. **Interactive & Engaging**
- Hover effects with `transform` and `scale`
- Smooth transitions (`transition-all duration-300`)
- Animated elements (`animate-bounce`)

### 4. **Student-Friendly**
- Large, clear typography
- Generous spacing and padding
- Visual hierarchy with emojis and colors

## 🎨 Component Styling Examples

### Button Styles
```tsx
// Primary Button
className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all"

// Secondary Button
className="px-8 py-4 bg-white text-pink-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all"

// Accent Button
className="px-8 py-4 bg-yellow-300 text-orange-700 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all"
```

### Card Styles
```tsx
// Feature Card
className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"

// Stat Card
className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"

// Hero Card
className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-pink-400 to-rose-500 p-12 shadow-2xl"
```

### Navigation Item (Active)
```tsx
className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg shadow-pink-300/50"
```

### Navigation Item (Inactive)
```tsx
className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100"
```

## 📱 Responsive Design

### Breakpoints
- Mobile: Default styling
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

### Mobile Considerations
- Sidebar can be toggled/collapsed
- Stack cards vertically on mobile
- Larger touch targets (min 44px)

## 🎭 Animations

### Hover Effects
```css
hover:shadow-xl hover:-translate-y-1
hover:scale-105
group-hover:scale-110
```

### Loading States
```css
animate-spin (for spinners)
animate-bounce (for playful elements)
animate-pulse (for subtle attention)
```

### Transitions
```css
transition-all duration-300 (standard)
transition-transform (for scale/translate)
transition-colors (for color changes)
```

## 🎨 Icon Usage

### Emoji Guidelines
Use emojis for visual appeal and quick recognition:
- 📚 Lessons/Books
- ✨ Premium/Special features
- 🌟 Achievements/Stars
- 🎉 Success/Celebration
- 🚀 Progress/Growth
- 💬 Chat/Communication
- 📖 Vocabulary
- 👥 Groups/Classes
- ✏️ Practice/Writing
- 📊 Statistics/Progress
- 🏆 Rewards/Leaderboard
- 🤖 AI Features
- 🎯 Goals/Targets

## 📝 Typography

### Font Weights
- Regular: Normal text
- Medium: `font-medium` for labels
- Semibold: `font-semibold` for sub-headings
- Bold: `font-bold` for headings
- Extrabold: `font-extrabold` for hero text

### Text Sizes
- Hero: `text-5xl` to `text-6xl`
- Heading: `text-3xl` to `text-4xl`
- Subheading: `text-xl` to `text-2xl`
- Body: `text-base` to `text-lg`
- Small: `text-sm`
- Tiny: `text-xs`

### Text Colors
- Primary text: `text-gray-800` or `text-gray-900`
- Secondary text: `text-gray-600`
- Muted text: `text-gray-500`
- Light text: `text-gray-400`
- Gradient text: `bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent`

## 🎯 Accessibility

- Maintain sufficient color contrast
- Use semantic HTML elements
- Provide alt text for images
- Keyboard navigation support
- Focus states for interactive elements

## 🚀 Implementation Checklist

- [x] Updated color palette with orange-pink theme
- [x] Converted header to sidebar navigation
- [x] Added gradient backgrounds
- [x] Implemented hover animations
- [x] Added emoji icons throughout
- [x] Updated button styles with gradients
- [x] Redesigned Home page with new theme
- [ ] Update remaining pages (Lessons, Vocabulary, etc.)
- [ ] Update modal/dialog styles
- [ ] Update form input styles
- [ ] Update table/list styles
- [ ] Add loading states with new theme
- [ ] Add error states with new theme

## 📚 Resources

### Inspiration
- Duolingo's playful design
- Kahoot's colorful engagement
- Modern education apps

### Tools
- Tailwind CSS utility classes
- CSS gradients and animations
- Emoji for icons and decoration
