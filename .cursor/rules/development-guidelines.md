# Development Guidelines

## Getting Started

### Prerequisites
- Node.js >= 16.x
- Yarn >= 1.22.x
- Modern browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd Doan2_Linh

# Install dependencies (use yarn, not npm)
yarn install

# Start development server
yarn dev

# Open browser at http://localhost:5173 (or shown port)
```

### Development Scripts

```bash
# Start dev server with hot reload
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code (if configured)
yarn lint
```

## Development Workflow

### 1. Feature Development Flow

```
1. Checkout new branch
   └─> git checkout -b feature/feature-name

2. Develop feature
   └─> Write code
   └─> Test locally
   └─> Fix linting issues

3. Commit changes
   └─> git add .
   └─> git commit -m "feat: add feature description"

4. Push and create PR
   └─> git push origin feature/feature-name
```

### 2. Branching Strategy

```
main (production)
  └─> develop (development)
       ├─> feature/user-profile
       ├─> feature/post-filtering
       ├─> fix/login-modal-bug
       └─> refactor/location-dropdown
```

**Branch naming**:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `style/` - Code style changes
- `test/` - Testing

## Module Development

### Creating a New Page

#### 1. Create HTML File
```html
<!-- new-page.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/static/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Page - Nhà đất</title>
        
        <!-- Base styles -->
        <link rel="stylesheet" href="./src/styles/normalize.css" />
        <link rel="stylesheet" href="./src/styles/base.css" />
        <link rel="stylesheet" href="./src/styles/grid.css" />
        
        <!-- Page-specific styles -->
        <link rel="stylesheet" href="./src/styles/new-page.css" />
    </head>
    <body>
        <div id="app">
            <!-- Page content -->
        </div>
        
        <script type="module" src="./src/js/new-page.js"></script>
    </body>
</html>
```

#### 2. Create JavaScript File
```javascript
// src/js/new-page.js
import toast from './toast'
import { formatPrice } from './helpers/convertConcurrency'

const app = {
    // State
    data: [],
    isLoading: false,
    
    // Initialize
    init() {
        this.setupEventListeners()
        this.loadData()
        this.render()
    },
    
    // Setup events
    setupEventListeners() {
        const button = document.querySelector('#myButton')
        button?.addEventListener('click', () => this.handleClick())
    },
    
    // Load data
    async loadData() {
        this.isLoading = true
        try {
            const stored = localStorage.getItem('myData')
            this.data = stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Không thể tải dữ liệu')
        } finally {
            this.isLoading = false
        }
    },
    
    // Event handlers
    handleClick() {
        toast.success('Button clicked!')
    },
    
    // Render
    render() {
        const container = document.querySelector('#container')
        if (!container) return
        
        container.innerHTML = this.data.map(item => `
            <div class="item">
                <h3>${item.title}</h3>
                <p>${formatPrice(item.price)}</p>
            </div>
        `).join('')
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    app.init()
})

export default app
```

#### 3. Create CSS File
```css
/* src/styles/new-page.css */

/* Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Components */
.item {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

#### 4. Update Vite Config
```javascript
// vite.config.js
export default defineConfig({
    // ...
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                // ... existing entries
                newPage: 'new-page.html', // Add this
            },
        },
    },
})
```

### Creating a Component

#### Example: Card Component

```javascript
// src/js/card.js
const card = {
    /**
     * Create a card element
     * @param {Object} data - Card data
     * @returns {string} HTML string
     */
    create(data) {
        const { title, description, image, price, location } = data
        
        return `
            <div class="card" data-id="${data.id}">
                <div class="card__image">
                    <img src="${image || '/static/placeholder.png'}" alt="${title}" />
                </div>
                <div class="card__content">
                    <h3 class="card__title">${title}</h3>
                    <p class="card__description">${description}</p>
                    <div class="card__info">
                        <span class="card__price">${price}</span>
                        <span class="card__location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${location}
                        </span>
                    </div>
                </div>
                <div class="card__actions">
                    <button class="btn btn--primary" data-action="view">
                        Xem chi tiết
                    </button>
                    <button class="btn btn--outline" data-action="favorite">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>
        `
    },
    
    /**
     * Render multiple cards
     * @param {Array} items - Array of card data
     * @param {string} containerId - Container element ID
     */
    renderList(items, containerId) {
        const container = document.querySelector(`#${containerId}`)
        if (!container) return
        
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-state">Không có dữ liệu</p>'
            return
        }
        
        container.innerHTML = items.map(item => this.create(item)).join('')
        
        // Setup event listeners for cards
        this.setupEventListeners(container)
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners(container) {
        container.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action
            const cardId = e.target.closest('.card')?.dataset.id
            
            if (action === 'view') {
                this.handleView(cardId)
            } else if (action === 'favorite') {
                this.handleFavorite(cardId)
            }
        })
    },
    
    handleView(id) {
        window.location.href = `/details.html?id=${id}`
    },
    
    handleFavorite(id) {
        // Toggle favorite logic
        console.log('Toggle favorite:', id)
    }
}

export default card
```

```css
/* src/styles/card.css */
.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card__content {
    padding: 1rem;
}

.card__title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.card__description {
    color: #666;
    margin-bottom: 1rem;
}

.card__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card__price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #e74c3c;
}

.card__location {
    color: #666;
    font-size: 0.875rem;
}

.card__actions {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
}
```

### Creating a Helper Function

```javascript
// src/js/helpers/dateFormatter.js

/**
 * Format date to Vietnamese format
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'N/A'
    
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    
    return `${day}/${month}/${year}`
}

/**
 * Format date to relative time (e.g., "2 giờ trước")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 7) return formatDate(date)
    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return 'Vừa xong'
}

/**
 * Check if date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
    const d = new Date(date)
    const today = new Date()
    
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear()
}

export default {
    formatDate,
    formatRelativeTime,
    isToday
}
```

## Working with LocalStorage

### Data Management Pattern

```javascript
// src/js/storage.js
const storage = {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Parsed value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error(`Error reading from localStorage: ${key}`, error)
            return defaultValue
        }
    },
    
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            return true
        } catch (error) {
            console.error(`Error writing to localStorage: ${key}`, error)
            return false
        }
    },
    
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            console.error(`Error removing from localStorage: ${key}`, error)
            return false
        }
    },
    
    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            console.error('Error clearing localStorage', error)
            return false
        }
    },
    
    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(key) !== null
    }
}

export default storage
```

### Usage Example

```javascript
import storage from './storage'
import mockPosts from '../mocks/posts'

const app = {
    posts: [],
    
    init() {
        this.loadPosts()
    },
    
    loadPosts() {
        // Load from storage with fallback to mock data
        this.posts = storage.get('posts', mockPosts)
    },
    
    savePost(post) {
        this.posts.push(post)
        storage.set('posts', this.posts)
    },
    
    updatePost(id, updates) {
        const index = this.posts.findIndex(p => p.id === id)
        if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updates }
            storage.set('posts', this.posts)
        }
    },
    
    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id)
        storage.set('posts', this.posts)
    }
}
```

## Event Handling

### Event Delegation Pattern

```javascript
// ✅ GOOD - Event delegation
const container = document.querySelector('#posts-container')

container.addEventListener('click', (e) => {
    // Handle delete button
    const deleteBtn = e.target.closest('[data-action="delete"]')
    if (deleteBtn) {
        const postId = deleteBtn.dataset.id
        handleDelete(postId)
        return
    }
    
    // Handle edit button
    const editBtn = e.target.closest('[data-action="edit"]')
    if (editBtn) {
        const postId = editBtn.dataset.id
        handleEdit(postId)
        return
    }
    
    // Handle card click
    const card = e.target.closest('.post-card')
    if (card) {
        const postId = card.dataset.id
        handleView(postId)
    }
})

// ❌ BAD - Individual listeners
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => { /* ... */ })
})
```

### Custom Events

```javascript
// Create custom event
const postCreated = new CustomEvent('postCreated', {
    detail: { postId: 123, title: 'New Post' }
})

// Dispatch event
document.dispatchEvent(postCreated)

// Listen for custom event
document.addEventListener('postCreated', (e) => {
    console.log('Post created:', e.detail)
})
```

## Form Handling

### Using Validator.js

```javascript
import Validator from './Validator'

// Setup validation
Validator({
    form: '#post-form',
    formGroup: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#title', 'Vui lòng nhập tiêu đề'),
        Validator.minLength('#title', 10, 'Tiêu đề phải có ít nhất 10 ký tự'),
        Validator.isRequired('#price', 'Vui lòng nhập giá'),
        Validator.isNumber('#price', 'Giá phải là số'),
        Validator.isRequired('#description', 'Vui lòng nhập mô tả'),
        Validator.isRequired('#location', 'Vui lòng chọn địa điểm'),
    ],
    onSubmit: (data) => {
        // Handle form submission
        console.log('Form data:', data)
        submitPost(data)
    }
})
```

### Form Data Handling

```javascript
const handleFormSubmit = (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    // Process data
    const post = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        userId: currentUser.id
    }
    
    // Save to storage
    savePost(post)
    
    // Show success message
    toast.success('Đăng tin thành công!')
    
    // Redirect
    setTimeout(() => {
        window.location.href = '/index.html'
    }, 1500)
}
```

## Debugging

### Console Methods

```javascript
// Development only
if (import.meta.env.DEV) {
    console.log('Current state:', app.state)
    console.table(app.posts)
    console.group('Filter Results')
    console.log('Filters:', filters)
    console.log('Results:', filteredPosts)
    console.groupEnd()
}

// Production - use toast for user-facing errors
try {
    // ... code
} catch (error) {
    console.error('Error:', error)
    toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
}
```

### Browser DevTools

```javascript
// Expose app to window for debugging (dev only)
if (import.meta.env.DEV) {
    window.__APP__ = app
    window.__DEBUG__ = {
        getPosts: () => app.posts,
        getFilters: () => app.filters,
        clearStorage: () => localStorage.clear(),
        resetData: () => {
            localStorage.setItem('posts', JSON.stringify(mockPosts))
            location.reload()
        }
    }
}
```

## Performance Tips

### DOM Manipulation

```javascript
// ✅ GOOD - Batch DOM updates
const fragment = document.createDocumentFragment()
items.forEach(item => {
    const div = document.createElement('div')
    div.innerHTML = createCard(item)
    fragment.appendChild(div.firstChild)
})
container.appendChild(fragment)

// ❌ BAD - Multiple DOM updates
items.forEach(item => {
    container.innerHTML += createCard(item)
})
```

### Debounce/Throttle

```javascript
// Debounce helper
const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

// Usage: Search input
const searchInput = document.querySelector('#search')
const handleSearch = debounce((value) => {
    // Perform search
    console.log('Searching for:', value)
}, 300)

searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value)
})
```

## Common Patterns

### Loading States

```javascript
const setLoading = (isLoading) => {
    const loader = document.querySelector('.loader')
    const content = document.querySelector('.content')
    
    if (isLoading) {
        loader?.classList.remove('hidden')
        content?.classList.add('hidden')
    } else {
        loader?.classList.add('hidden')
        content?.classList.remove('hidden')
    }
}

// Usage
setLoading(true)
await fetchData()
setLoading(false)
```

### Empty States

```javascript
const renderPosts = (posts) => {
    const container = document.querySelector('#posts-container')
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox fa-3x"></i>
                <h3>Không có bài đăng nào</h3>
                <p>Hãy thử thay đổi bộ lọc hoặc tạo bài đăng mới</p>
                <a href="/post.html" class="btn btn--primary">
                    Đăng tin
                </a>
            </div>
        `
        return
    }
    
    container.innerHTML = posts.map(createPostCard).join('')
}
```

