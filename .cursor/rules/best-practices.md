# Best Practices

## Code Quality

### 1. Single Responsibility Principle

```javascript
// ✅ GOOD - Each function has one clear purpose
const filterByPrice = (posts, minPrice, maxPrice) => {
    return posts.filter(post => post.price >= minPrice && post.price <= maxPrice)
}

const filterByLocation = (posts, location) => {
    return posts.filter(post => post.location.includes(location))
}

const filterByCategory = (posts, category) => {
    return posts.filter(post => post.category === category)
}

// ❌ BAD - Function does too many things
const filterPosts = (posts, filters) => {
    let result = posts
    if (filters.price) {
        result = result.filter(post => /* ... */)
    }
    if (filters.location) {
        result = result.filter(post => /* ... */)
    }
    if (filters.category) {
        result = result.filter(post => /* ... */)
    }
    result = result.map(post => ({ ...post, formatted: true }))
    result.sort((a, b) => a.price - b.price)
    return result
}
```

### 2. DRY (Don't Repeat Yourself)

```javascript
// ✅ GOOD - Reusable function
const createButton = (text, className, onClick) => {
    const btn = document.createElement('button')
    btn.textContent = text
    btn.className = className
    btn.addEventListener('click', onClick)
    return btn
}

const deleteBtn = createButton('Xóa', 'btn btn--danger', handleDelete)
const editBtn = createButton('Sửa', 'btn btn--primary', handleEdit)
const viewBtn = createButton('Xem', 'btn btn--outline', handleView)

// ❌ BAD - Repeated code
const deleteBtn = document.createElement('button')
deleteBtn.textContent = 'Xóa'
deleteBtn.className = 'btn btn--danger'
deleteBtn.addEventListener('click', handleDelete)

const editBtn = document.createElement('button')
editBtn.textContent = 'Sửa'
editBtn.className = 'btn btn--primary'
editBtn.addEventListener('click', handleEdit)
```

### 3. Avoid Magic Numbers

```javascript
// ✅ GOOD - Named constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_IMAGES = 10
const DEFAULT_PAGE_SIZE = 20
const TOAST_DURATION = 3000 // 3 seconds

if (file.size > MAX_FILE_SIZE) {
    toast.error(`Kích thước file tối đa ${MAX_FILE_SIZE / 1024 / 1024}MB`)
}

// ❌ BAD - Magic numbers
if (file.size > 5242880) {
    toast.error('Kích thước file tối đa 5MB')
}

setTimeout(() => hideToast(), 3000)
```

### 4. Meaningful Names

```javascript
// ✅ GOOD - Clear, descriptive names
const getUserById = (id) => { /* ... */ }
const calculateTotalPrice = (items) => { /* ... */ }
const isValidEmail = (email) => { /* ... */ }
const filteredPosts = posts.filter(/* ... */)

// ❌ BAD - Unclear names
const get = (id) => { /* ... */ }
const calc = (items) => { /* ... */ }
const check = (email) => { /* ... */ }
const temp = posts.filter(/* ... */)
```

### 5. Error Handling

```javascript
// ✅ GOOD - Proper error handling
const fetchPosts = async () => {
    try {
        const response = await fetch('/api/posts')
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching posts:', error)
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
        return []
    }
}

// ❌ BAD - No error handling
const fetchPosts = async () => {
    const response = await fetch('/api/posts')
    const data = await response.json()
    return data
}
```

## Performance Best Practices

### 1. DOM Manipulation

```javascript
// ✅ GOOD - Batch DOM operations
const renderPosts = (posts) => {
    const html = posts.map(post => createPostCard(post)).join('')
    container.innerHTML = html
}

// ✅ GOOD - Use DocumentFragment
const fragment = document.createDocumentFragment()
posts.forEach(post => {
    const card = createPostElement(post)
    fragment.appendChild(card)
})
container.appendChild(fragment)

// ❌ BAD - Multiple reflows
posts.forEach(post => {
    container.innerHTML += createPostCard(post)
})
```

### 2. Event Listeners

```javascript
// ✅ GOOD - Event delegation
const container = document.querySelector('#container')
container.addEventListener('click', (e) => {
    const button = e.target.closest('.delete-btn')
    if (button) {
        handleDelete(button.dataset.id)
    }
})

// ❌ BAD - Multiple listeners
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id))
})
```

### 3. Debounce Heavy Operations

```javascript
// ✅ GOOD - Debounce search
const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

const searchInput = document.querySelector('#search')
const performSearch = debounce((query) => {
    // Heavy search operation
    const results = searchPosts(query)
    displayResults(results)
}, 300)

searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value)
})

// ❌ BAD - Search on every keystroke
searchInput.addEventListener('input', (e) => {
    const results = searchPosts(e.target.value)
    displayResults(results)
})
```

### 4. Cache DOM Queries

```javascript
// ✅ GOOD - Cache selectors
const app = {
    elements: {
        container: null,
        sidebar: null,
        header: null
    },
    
    init() {
        // Cache once
        this.elements.container = document.querySelector('#container')
        this.elements.sidebar = document.querySelector('#sidebar')
        this.elements.header = document.querySelector('#header')
    },
    
    render() {
        // Use cached elements
        this.elements.container.innerHTML = '...'
    }
}

// ❌ BAD - Query every time
const render = () => {
    document.querySelector('#container').innerHTML = '...'
    document.querySelector('#sidebar').classList.add('active')
    document.querySelector('#header').style.display = 'block'
}
```

### 5. Lazy Loading

```javascript
// ✅ GOOD - Lazy load images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
            }
        })
    })
    
    images.forEach(img => imageObserver.observe(img))
}
```

## Security Best Practices

### 1. XSS Prevention

```javascript
// ✅ GOOD - Escape user input
const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

const renderComment = (comment) => {
    return `
        <div class="comment">
            <p>${escapeHtml(comment.text)}</p>
            <span>${escapeHtml(comment.author)}</span>
        </div>
    `
}

// ❌ BAD - Direct insertion of user input
const renderComment = (comment) => {
    return `
        <div class="comment">
            <p>${comment.text}</p>
            <span>${comment.author}</span>
        </div>
    `
}
```

### 2. Data Validation

```javascript
// ✅ GOOD - Validate before storage
const savePost = (data) => {
    // Validate required fields
    if (!data.title || data.title.trim() === '') {
        throw new Error('Title is required')
    }
    
    if (!data.price || isNaN(data.price) || data.price < 0) {
        throw new Error('Valid price is required')
    }
    
    // Sanitize data
    const sanitizedData = {
        id: Date.now(),
        title: data.title.trim().slice(0, 200),
        price: parseFloat(data.price),
        description: data.description.trim(),
        createdAt: new Date().toISOString()
    }
    
    storage.set('posts', [...storage.get('posts', []), sanitizedData])
}

// ❌ BAD - No validation
const savePost = (data) => {
    storage.set('posts', [...storage.get('posts', []), data])
}
```

### 3. Sensitive Data

```javascript
// ✅ GOOD - Don't store sensitive data in localStorage
const login = async (credentials) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
    
    const { token, user } = await response.json()
    
    // Store only token (with expiry)
    storage.set('authToken', { token, expiresAt: Date.now() + 3600000 })
    storage.set('user', { id: user.id, name: user.name }) // No password!
}

// ❌ BAD - Storing password
storage.set('user', { username: 'user', password: 'plain-text-password' })
```

## Accessibility Best Practices

### 1. Semantic HTML

```html
<!-- ✅ GOOD - Semantic elements -->
<header>
    <nav>
        <ul>
            <li><a href="/">Trang chủ</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h1>Tiêu đề bài viết</h1>
        <p>Nội dung...</p>
    </article>
</main>

<footer>
    <p>&copy; 2024 Company</p>
</footer>

<!-- ❌ BAD - Generic divs -->
<div class="header">
    <div class="nav">
        <div class="menu">
            <div><a href="/">Trang chủ</a></div>
        </div>
    </div>
</div>
```

### 2. ARIA Labels

```html
<!-- ✅ GOOD - Descriptive labels -->
<button aria-label="Đóng modal" class="close-btn">
    <i class="fa-solid fa-times"></i>
</button>

<input 
    type="search" 
    id="search" 
    aria-label="Tìm kiếm bất động sản"
    placeholder="Nhập từ khóa..."
/>

<!-- ❌ BAD - No context for screen readers -->
<button class="close-btn">
    <i class="fa-solid fa-times"></i>
</button>
```

### 3. Keyboard Navigation

```javascript
// ✅ GOOD - Support keyboard navigation
const modal = {
    open() {
        this.element.classList.add('active')
        this.element.setAttribute('aria-hidden', 'false')
        
        // Focus first focusable element
        const firstFocusable = this.element.querySelector('button, input, a')
        firstFocusable?.focus()
        
        // Trap focus in modal
        this.trapFocus()
    },
    
    close() {
        this.element.classList.remove('active')
        this.element.setAttribute('aria-hidden', 'true')
        
        // Return focus to trigger element
        this.trigger?.focus()
    },
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.close()
        }
    }
}
```

### 4. Alt Text for Images

```html
<!-- ✅ GOOD - Descriptive alt text -->
<img 
    src="/static/property-1.jpg" 
    alt="Căn hộ 2 phòng ngủ tại quận 1, TP.HCM"
/>

<!-- Decorative image -->
<img 
    src="/static/decoration.png" 
    alt=""
    role="presentation"
/>

<!-- ❌ BAD - No alt or generic alt -->
<img src="/static/property-1.jpg" />
<img src="/static/property-1.jpg" alt="image" />
```

## Code Organization

### 1. Module Pattern

```javascript
// ✅ GOOD - Clear module structure
const userModule = {
    // Private state (using closure if needed)
    _currentUser: null,
    
    // Public API
    getCurrentUser() {
        return this._currentUser
    },
    
    setCurrentUser(user) {
        this._currentUser = user
        this.emit('userChanged', user)
    },
    
    isAuthenticated() {
        return this._currentUser !== null
    },
    
    // Event system
    listeners: {},
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
    },
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data))
        }
    }
}

export default userModule
```

### 2. Configuration

```javascript
// ✅ GOOD - Centralized config
// src/js/config.js
export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        timeout: 10000
    },
    
    storage: {
        keys: {
            posts: 'posts',
            user: 'currentUser',
            filters: 'savedFilters'
        }
    },
    
    validation: {
        minTitleLength: 10,
        maxTitleLength: 200,
        minPrice: 0,
        maxPrice: 1000000000,
        maxImages: 10,
        maxFileSize: 5 * 1024 * 1024
    },
    
    ui: {
        toastDuration: 3000,
        debounceDelay: 300,
        itemsPerPage: 20
    }
}

export default config
```

### 3. Constants

```javascript
// ✅ GOOD - Named constants
// src/js/constants.js
export const POST_TYPES = {
    SELL: 'sell',
    RENT: 'rent'
}

export const PROPERTY_CATEGORIES = {
    APARTMENT: 'apartment',
    HOUSE: 'house',
    LAND: 'land',
    ROOM: 'room'
}

export const USER_ROLES = {
    GUEST: 'guest',
    USER: 'user',
    AGENT: 'agent',
    ADMIN: 'admin'
}

export const POST_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
}

// Usage
import { POST_TYPES, PROPERTY_CATEGORIES } from './constants'

if (post.type === POST_TYPES.SELL) {
    // ...
}
```

## Testing Considerations

### 1. Testable Functions

```javascript
// ✅ GOOD - Pure function, easy to test
export const calculateTotalPrice = (items, taxRate = 0.1) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const tax = subtotal * taxRate
    return subtotal + tax
}

// Test:
// expect(calculateTotalPrice([{price: 100}, {price: 200}])).toBe(330)

// ❌ BAD - Depends on external state, hard to test
const calculateTotalPrice = () => {
    const items = document.querySelectorAll('.cart-item')
    let total = 0
    items.forEach(item => {
        total += parseFloat(item.dataset.price)
    })
    return total * 1.1
}
```

### 2. Avoid Side Effects

```javascript
// ✅ GOOD - No side effects
export const filterPosts = (posts, criteria) => {
    return posts.filter(post => post.category === criteria)
}

// ❌ BAD - Modifies input
export const filterPosts = (posts, criteria) => {
    posts.forEach((post, index) => {
        if (post.category !== criteria) {
            posts.splice(index, 1)
        }
    })
    return posts
}
```

## Documentation

### 1. JSDoc Comments

```javascript
/**
 * Filter posts based on multiple criteria
 * @param {Array<Post>} posts - Array of post objects
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.category] - Post category (sell/rent)
 * @param {string[]} [filters.types] - Property types
 * @param {Object} [filters.priceRange] - Price range
 * @param {number} [filters.priceRange.min] - Minimum price
 * @param {number} [filters.priceRange.max] - Maximum price
 * @returns {Array<Post>} Filtered posts
 * @example
 * const filtered = filterPosts(posts, {
 *   category: 'sell',
 *   types: ['apartment', 'house'],
 *   priceRange: { min: 1000000, max: 5000000 }
 * })
 */
export const filterPosts = (posts, filters) => {
    // Implementation
}
```

### 2. README in Complex Modules

```javascript
// src/js/helpers/README.md
/**
 * # Helper Functions
 * 
 * ## convertConcurrency.js
 * - `formatPrice(number)` - Format number to VND currency
 * - `convertConcurrencyToNumber(string)` - Parse currency string to number
 * 
 * ## dateFormatter.js
 * - `formatDate(date)` - Format date to DD/MM/YYYY
 * - `formatRelativeTime(date)` - Format to relative time (2 giờ trước)
 * 
 * ## validation.js
 * - `isValidEmail(string)` - Check if email is valid
 * - `isValidPhone(string)` - Check if phone is valid
 */
```

## Common Anti-Patterns to Avoid

### ❌ Global Variables

```javascript
// ❌ BAD
window.currentUser = null
window.posts = []

// ✅ GOOD - Use modules
const state = {
    currentUser: null,
    posts: []
}
export default state
```

### ❌ Callback Hell

```javascript
// ❌ BAD
getData((data) => {
    processData(data, (result) => {
        saveData(result, (saved) => {
            showSuccess(() => {
                // ...
            })
        })
    })
})

// ✅ GOOD - Use async/await
const workflow = async () => {
    const data = await getData()
    const result = await processData(data)
    await saveData(result)
    showSuccess()
}
```

### ❌ Tight Coupling

```javascript
// ❌ BAD - Tight coupling
class PostList {
    render() {
        const data = localStorage.getItem('posts') // Direct dependency
        // ...
    }
}

// ✅ GOOD - Loose coupling via dependency injection
class PostList {
    constructor(storage) {
        this.storage = storage
    }
    
    render() {
        const data = this.storage.get('posts')
        // ...
    }
}
```

