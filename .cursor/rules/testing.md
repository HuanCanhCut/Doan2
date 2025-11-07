# Testing Guidelines

## Testing Strategy

Dự án này sử dụng Vanilla JavaScript, nên testing được thực hiện qua:
1. **Manual Testing** - Testing thủ công qua browser
2. **Browser DevTools** - Debugging và inspection
3. **Console Testing** - Testing functions trong console
4. **User Testing** - Testing từ góc độ người dùng

## Manual Testing Checklist

### 1. Homepage / Index Page

#### Layout & UI
- [ ] Header hiển thị đúng với logo
- [ ] Location dropdown hoạt động
- [ ] Sidebar có thể toggle (mobile)
- [ ] Filter panel hiển thị đúng
- [ ] Grid layout responsive trên mọi màn hình

#### Functionality
- [ ] Filter theo category (Mua bán/Cho thuê)
- [ ] Filter theo property type (Căn hộ/Nhà/Đất/Phòng)
- [ ] Filter theo price range
- [ ] Filter theo location (Province/District/Ward)
- [ ] Filter theo post type (All/Agent/Personal)
- [ ] Multiple filters hoạt động đồng thời
- [ ] Clear filter hoạt động
- [ ] Posts hiển thị đúng sau khi filter

#### Data
- [ ] Load posts từ localStorage
- [ ] Fallback sang mock data nếu localStorage trống
- [ ] Posts data structure đúng
- [ ] Images hiển thị đúng

#### Interaction
- [ ] Click vào post card -> navigate đến details
- [ ] Favorite button hoạt động
- [ ] Share button hoạt động
- [ ] Pagination hoạt động (nếu có)

### 2. Post Creation Page

#### Form Validation
- [ ] Title: required, min 10 chars, max 200 chars
- [ ] Price: required, must be number, > 0
- [ ] Description: required, min 50 chars
- [ ] Location: required (Province/District/Ward)
- [ ] Property type: required
- [ ] Category: required (Sell/Rent)
- [ ] Role: required (Personal/Agent)
- [ ] Images: max 10 files, max 5MB each

#### Form Functionality
- [ ] Category radio buttons hoạt động
- [ ] Role radio buttons hoạt động
- [ ] Property type dropdown hoạt động
- [ ] Location dropdowns cascade (Province -> District -> Ward)
- [ ] Image upload preview hoạt động
- [ ] Remove uploaded image hoạt động
- [ ] Currency input format đúng (VND)
- [ ] Area input accepts numbers

#### Submission
- [ ] Validation errors hiển thị đúng
- [ ] Cannot submit với invalid data
- [ ] Success message sau khi submit
- [ ] Data được save vào localStorage
- [ ] Redirect về homepage sau khi submit
- [ ] Toast notification hiển thị

### 3. Details Page

#### Display
- [ ] Post details hiển thị đầy đủ
- [ ] Images gallery hoạt động
- [ ] Image navigation (prev/next)
- [ ] Image zoom/lightbox hoạt động
- [ ] Price format đúng
- [ ] Location hiển thị đúng
- [ ] Seller info hiển thị
- [ ] Post date format đúng

#### Functionality
- [ ] Contact seller button
- [ ] Favorite button
- [ ] Share button
- [ ] Back to list button
- [ ] Related posts hiển thị (nếu có)

#### Data
- [ ] Load post by ID từ URL params
- [ ] Handle invalid post ID (404)
- [ ] Images load correctly
- [ ] Seller info correct

### 4. User Profile Page

#### Display
- [ ] User avatar hiển thị
- [ ] User info hiển thị đúng
- [ ] User stats (posts count, etc.)
- [ ] User's posts list
- [ ] Favorite posts list (nếu có)

#### Edit Profile
- [ ] Edit button mở form
- [ ] Form validation
- [ ] Avatar upload hoạt động
- [ ] Save changes hoạt động
- [ ] Cancel restores original data
- [ ] Success notification

#### User Posts
- [ ] List all user's posts
- [ ] Edit post button
- [ ] Delete post button
- [ ] Delete confirmation modal
- [ ] Post status (published/draft)

### 5. Admin Manager Posts Page

#### Display
- [ ] All posts table/list
- [ ] Filters for admin
- [ ] Search functionality
- [ ] Sorting options

#### Management
- [ ] View post details
- [ ] Edit any post
- [ ] Delete any post
- [ ] Approve/reject posts
- [ ] Change post status
- [ ] Bulk actions (nếu có)

### 6. Authentication Modals

#### Login Modal
- [ ] Modal mở đúng
- [ ] Email validation
- [ ] Password required
- [ ] Remember me checkbox
- [ ] Login button
- [ ] Error messages
- [ ] Success redirects
- [ ] Close modal button
- [ ] Click overlay closes modal
- [ ] ESC key closes modal

#### Register Modal
- [ ] Modal mở đúng
- [ ] All fields validate
- [ ] Email format check
- [ ] Password strength check
- [ ] Confirm password matches
- [ ] Terms checkbox required
- [ ] Register button
- [ ] Switch to login modal
- [ ] Success message

### 7. Location Dropdown Component

#### Functionality
- [ ] Province list loads
- [ ] Click province shows districts
- [ ] Click district shows wards
- [ ] Selected location displays
- [ ] Clear selection hoạt động
- [ ] Search trong dropdown (nếu có)

#### Data
- [ ] Provinces load từ JSON
- [ ] Districts load từ JSON
- [ ] Wards load từ JSON
- [ ] Hierarchy correct (Province -> District -> Ward)

### 8. Toast Notifications

#### Display
- [ ] Toast hiển thị đúng position
- [ ] Success toast (green)
- [ ] Error toast (red)
- [ ] Warning toast (yellow)
- [ ] Info toast (blue)

#### Behavior
- [ ] Auto dismiss sau 3s
- [ ] Close button hoạt động
- [ ] Multiple toasts stack correctly
- [ ] Animation smooth

### 9. Sidebar Navigation

#### Desktop
- [ ] Always visible
- [ ] All menu items visible
- [ ] Active state correct
- [ ] Navigation links work

#### Mobile
- [ ] Hidden by default
- [ ] Toggle button shows/hides
- [ ] Overlay appears when open
- [ ] Click overlay closes sidebar
- [ ] Smooth animation

## Cross-browser Testing

Test trên các browsers sau:

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet (Android)

### Test Points
- [ ] Layout renders correctly
- [ ] JavaScript hoạt động
- [ ] CSS animations/transitions
- [ ] Form validation
- [ ] LocalStorage hoạt động
- [ ] Modals hoạt động
- [ ] Image upload hoạt động

## Responsive Testing

### Breakpoints to Test

```css
/* Mobile: < 768px */
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X/11/12)
- [ ] 414px (iPhone Plus)

/* Tablet: 768px - 1024px */
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)

/* Desktop: > 1024px */
- [ ] 1280px (Laptop)
- [ ] 1440px (Desktop)
- [ ] 1920px (Full HD)
```

### Responsive Checklist

#### Mobile (< 768px)
- [ ] Sidebar toggleable
- [ ] Navigation hamburger menu
- [ ] Forms full width
- [ ] Images responsive
- [ ] Buttons touch-friendly (min 44px)
- [ ] Text readable (min 16px)
- [ ] Grid single column
- [ ] Filters in collapsible panel

#### Tablet (768px - 1024px)
- [ ] Sidebar visible or toggleable
- [ ] Grid 2 columns
- [ ] Forms readable
- [ ] Touch targets adequate

#### Desktop (> 1024px)
- [ ] Sidebar always visible
- [ ] Grid 3-4 columns
- [ ] Max content width
- [ ] Hover states work
- [ ] Forms optimal width

## Performance Testing

### Page Load
- [ ] Initial load < 3s
- [ ] Time to interactive < 5s
- [ ] No layout shift (CLS)
- [ ] Images lazy load
- [ ] No blocking resources

### Runtime Performance
- [ ] Smooth scrolling (60fps)
- [ ] Filter response < 100ms
- [ ] Form validation immediate
- [ ] No memory leaks
- [ ] No console errors

### Tools
```bash
# Lighthouse audit
lighthouse https://your-site.com --view

# Check scores:
Performance: > 90
Accessibility: > 90
Best Practices: > 90
SEO: > 90
```

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] ESC closes modals
- [ ] Arrow keys in dropdowns (nếu có)
- [ ] Focus visible
- [ ] Skip to main content link

### Screen Reader
- [ ] Test với NVDA (Windows) hoặc VoiceOver (Mac)
- [ ] All images có alt text
- [ ] Form labels associated
- [ ] ARIA labels present
- [ ] Headings hierarchy correct
- [ ] Links descriptive

### Visual
- [ ] Color contrast ratio > 4.5:1
- [ ] Text resizable to 200%
- [ ] No loss of content khi zoom
- [ ] Focus indicators visible

### Tools
```bash
# axe DevTools (Browser Extension)
# WAVE (Browser Extension)
# Lighthouse Accessibility Score
```

## Data Testing

### LocalStorage

```javascript
// Test trong browser console

// 1. Check if data exists
localStorage.getItem('posts')
localStorage.getItem('currentUser')

// 2. Add test data
const testPost = {
    id: Date.now(),
    title: 'Test Post',
    price: 1000000,
    // ... more fields
}
const posts = JSON.parse(localStorage.getItem('posts')) || []
posts.push(testPost)
localStorage.setItem('posts', JSON.stringify(posts))

// 3. Clear all data
localStorage.clear()

// 4. Test with mock data
localStorage.removeItem('posts')
location.reload() // Should load mock data

// 5. Test data structure
const posts = JSON.parse(localStorage.getItem('posts'))
console.table(posts)
```

### Data Validation

```javascript
// Test validation functions trong console

// 1. Import Validator functions
// (Copy functions to console or expose globally in dev)

// 2. Test email validation
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
console.log(isValidEmail('test@example.com')) // true
console.log(isValidEmail('invalid-email')) // false

// 3. Test price validation
const isValidPrice = (price) => {
    return !isNaN(price) && parseFloat(price) > 0
}
console.log(isValidPrice('1000000')) // true
console.log(isValidPrice('-100')) // false

// 4. Test required fields
const post = {
    title: 'Test',
    price: 1000000,
    description: 'Description'
}
const requiredFields = ['title', 'price', 'description', 'location']
const isValid = requiredFields.every(field => post[field])
console.log(isValid) // false (missing location)
```

## Error Testing

### Test Error Scenarios

#### 1. Network Errors
```javascript
// Simulate offline
// Chrome DevTools: Network tab -> Offline

// Test:
- [ ] Load page offline
- [ ] Submit form offline
- [ ] Error messages display
- [ ] Graceful fallback
```

#### 2. Invalid Data
```javascript
// Test trong console
const app = window.__APP__ // Exposed in dev mode

// Set invalid data
app.posts = null
app.render() // Should handle gracefully

app.posts = [{ invalid: 'data' }]
app.render() // Should handle missing fields
```

#### 3. Missing DOM Elements
```javascript
// Remove element and test
const element = document.querySelector('#important-element')
element.remove()

// Code should not crash
// Should show error message or skip gracefully
```

#### 4. LocalStorage Full
```javascript
// Fill localStorage (rare but possible)
try {
    for (let i = 0; i < 10000; i++) {
        localStorage.setItem(`test${i}`, 'x'.repeat(10000))
    }
} catch (e) {
    console.log('LocalStorage full:', e)
}

// Test app behavior
```

## Debug Helpers

### Development Mode Helpers

```javascript
// Add to dev build only
if (import.meta.env.DEV) {
    // Expose app to window
    window.__APP__ = app
    
    // Debug helpers
    window.__DEBUG__ = {
        // Get current state
        getState: () => app,
        
        // Get all posts
        getPosts: () => app.posts,
        
        // Get filtered posts
        getFilteredPosts: () => app.handleFilterPost(),
        
        // Clear localStorage
        clearStorage: () => {
            localStorage.clear()
            console.log('LocalStorage cleared')
        },
        
        // Reset to mock data
        resetData: () => {
            localStorage.clear()
            location.reload()
        },
        
        // Add test post
        addTestPost: () => {
            const testPost = {
                id: Date.now(),
                title: 'Test Post ' + Date.now(),
                price: Math.floor(Math.random() * 10000000),
                category: 'sell',
                property_category: 'apartment',
                // ... more fields
            }
            app.posts.push(testPost)
            localStorage.setItem('posts', JSON.stringify(app.posts))
            app.render()
            console.log('Test post added:', testPost)
        },
        
        // Simulate user
        simulateLogin: (role = 'user') => {
            const user = {
                id: Date.now(),
                name: 'Test User',
                email: 'test@example.com',
                role: role
            }
            localStorage.setItem('currentUser', JSON.stringify(user))
            console.log('Logged in as:', user)
        }
    }
    
    console.log('Debug helpers available: window.__DEBUG__')
}
```

### Usage Examples

```javascript
// Trong browser console:

// Check current state
__DEBUG__.getState()

// Reset app
__DEBUG__.resetData()

// Add test posts
__DEBUG__.addTestPost()
__DEBUG__.addTestPost()

// Simulate user
__DEBUG__.simulateLogin('admin')

// Get filtered results
__DEBUG__.getFilteredPosts()
```

## Testing Workflow

### Before Committing
1. [ ] Test all changed features
2. [ ] Test on multiple browsers
3. [ ] Test responsive design
4. [ ] Check console for errors
5. [ ] Run Lighthouse audit
6. [ ] Check accessibility

### Before Deploying
1. [ ] Full manual testing suite
2. [ ] Cross-browser testing
3. [ ] Performance testing
4. [ ] Mobile testing on real devices
5. [ ] User acceptance testing
6. [ ] Load testing (nếu có traffic cao)

### After Deploying
1. [ ] Smoke test production
2. [ ] Check analytics (nếu có)
3. [ ] Monitor error logs
4. [ ] Test critical paths
5. [ ] Verify all pages load

## Bug Reporting Template

Khi tìm thấy bug, ghi nhận theo format:

```markdown
## Bug: [Tiêu đề ngắn gọn]

**Severity**: Critical / High / Medium / Low

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- Screen: 1920x1080

**Steps to Reproduce**:
1. Go to post creation page
2. Fill all fields
3. Click submit
4. Error appears

**Expected Result**:
Post should be created successfully

**Actual Result**:
Error message: "Cannot read property of undefined"

**Screenshots**:
[Attach screenshots]

**Console Errors**:
```
TypeError: Cannot read property 'id' of undefined
  at app.savePost (post.js:123)
```

**Additional Info**:
- Happens only when localStorage is empty
- Works fine with existing data
```

## Automated Testing (Optional - Future Enhancement)

Nếu muốn thêm automated tests:

```bash
# Install Vitest
yarn add -D vitest @vitest/ui

# Install testing library
yarn add -D @testing-library/dom @testing-library/user-event

# Add test script to package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

Example test:
```javascript
// src/js/helpers/__tests__/convertConcurrency.test.js
import { describe, it, expect } from 'vitest'
import { formatPrice } from '../convertConcurrency'

describe('formatPrice', () => {
    it('formats number to VND currency', () => {
        expect(formatPrice(1000000)).toBe('1.000.000 ₫')
    })
    
    it('handles zero', () => {
        expect(formatPrice(0)).toBe('0 ₫')
    })
    
    it('handles invalid input', () => {
        expect(formatPrice('invalid')).toBe('N/A')
    })
})
```

