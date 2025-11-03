# Code Style Guidelines

## JavaScript Style Guide

### ES6+ Features
Luôn sử dụng các tính năng ES6+ hiện đại:

```javascript
// ✅ GOOD - Use const/let
const API_URL = 'https://api.example.com'
let currentUser = null

// ❌ BAD - Don't use var
var user = {}

// ✅ GOOD - Arrow functions
const filterPosts = (posts, criteria) => {
    return posts.filter(post => post.category === criteria)
}

// ✅ GOOD - Template literals
const greeting = `Xin chào, ${userName}!`

// ❌ BAD - String concatenation
const greeting = 'Xin chào, ' + userName + '!'

// ✅ GOOD - Destructuring
const { name, age, address } = user

// ✅ GOOD - Spread operator
const newArray = [...oldArray, newItem]

// ✅ GOOD - Object shorthand
const user = { name, age, email }
```

### Variable Naming

```javascript
// ✅ GOOD - camelCase for variables and functions
const userProfile = {}
const handleSubmit = () => {}

// ✅ GOOD - PascalCase for constructors/classes
class Validator {}
const MyComponent = {}

// ✅ GOOD - UPPER_SNAKE_CASE for constants
const MAX_FILE_SIZE = 5000000
const API_ENDPOINTS = {}

// ✅ GOOD - Meaningful names
const filteredPosts = posts.filter(...)
const isAuthenticated = true

// ❌ BAD - Single letter or unclear names
const x = posts.filter(...)
const flag = true
```

### Functions

```javascript
// ✅ GOOD - Single responsibility
const calculateTotalPrice = (items) => {
    return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ GOOD - Clear function names (verbs)
const validateEmail = (email) => { /* ... */ }
const fetchUserData = async (userId) => { /* ... */ }
const renderPostList = (posts) => { /* ... */ }

// ✅ GOOD - Early returns
const getUserRole = (user) => {
    if (!user) return 'guest'
    if (user.isAdmin) return 'admin'
    if (user.isAgent) return 'agent'
    return 'user'
}

// ❌ BAD - Deep nesting
const getUserRole = (user) => {
    if (user) {
        if (user.isAdmin) {
            return 'admin'
        } else {
            if (user.isAgent) {
                return 'agent'
            } else {
                return 'user'
            }
        }
    } else {
        return 'guest'
    }
}
```

### Comments

```javascript
// ✅ GOOD - Explain WHY, not WHAT
// Filter out expired posts to show only active listings
const activePosts = posts.filter(post => !post.isExpired)

// Calculate VAT at 10% rate (required by law)
const totalWithVAT = total * 1.1

// ❌ BAD - Obvious comments
// Set x to 10
const x = 10

// Loop through posts
posts.forEach(post => { /* ... */ })

// ✅ GOOD - JSDoc for complex functions
/**
 * Filters posts based on multiple criteria
 * @param {Array} posts - Array of post objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.category - Post category (sell/rent)
 * @param {Array} filters.types - Property types
 * @param {Object} filters.priceRange - Min/max price
 * @returns {Array} Filtered posts
 */
const filterPosts = (posts, filters) => { /* ... */ }
```

## Prettier Configuration

File `.prettierrc`:
```json
{
  "tabWidth": 4,
  "printWidth": 120,
  "semi": false,
  "singleQuote": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

### Rules Explanation
- **tabWidth: 4** - Sử dụng 4 spaces cho indentation
- **printWidth: 120** - Giới hạn độ dài dòng tối đa 120 ký tự
- **semi: false** - Không sử dụng semicolons
- **singleQuote: true** - Sử dụng single quotes
- **arrowParens: always** - Luôn có parentheses cho arrow functions
- **endOfLine: auto** - Tự động xử lý line endings

### Examples

```javascript
// ✅ GOOD - Follows Prettier rules
const longFunction = (param1, param2, param3) => {
    const result = someFunction('string with single quotes')
    return result
}

// ✅ GOOD - No semicolons
const user = {
    name: 'John',
    age: 30
}

// ✅ GOOD - Always parentheses for arrow functions
const double = (x) => x * 2
const greet = () => 'Hello'
```

## ESLint Configuration

### Active Rules

```javascript
// eslint.config.mjs
rules: {
    'simple-import-sort/exports': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-undef-init': 'warn',
    'eqeqeq': 'warn',
    'no-fallthrough': 'warn',
    'no-var': 'warn',
}
```

### Rule Explanations

```javascript
// ✅ simple-import-sort/exports
// Exports should be sorted alphabetically
export { beta, alpha, gamma } // Before
export { alpha, beta, gamma } // After

// ✅ no-unused-vars - Warn about unused variables
const unusedVar = 10 // ⚠️ Warning

// ✅ no-undef - Error on undefined variables
console.log(undefinedVariable) // ❌ Error

// ✅ eqeqeq - Use strict equality
if (value === 10) {} // ✅
if (value == 10) {}  // ⚠️ Warning

// ✅ no-var - Don't use var
const x = 10 // ✅
let y = 20   // ✅
var z = 30   // ⚠️ Warning

// ✅ no-fallthrough - Add break in switch cases
switch (type) {
    case 'sell':
        handleSell()
        break // Required
    case 'rent':
        handleRent()
        break
    default:
        handleDefault()
}
```

## Import Sorting

Sử dụng `eslint-plugin-simple-import-sort`:

```javascript
// ✅ GOOD - Sorted imports
// 1. External dependencies
import Validator from './Validator'

// 2. Internal modules - helpers
import convertConcurrency from './helpers/convertConcurrency'
import getParentElement from './helpers/getParentElement'

// 3. Internal modules - features
import defaultApp from './default'
import locationsDropdownApp from './locationsDropdown'
import toast from './toast'

// ❌ BAD - Unsorted imports
import toast from './toast'
import Validator from './Validator'
import defaultApp from './default'
import convertConcurrency from './helpers/convertConcurrency'
```

## CSS/SCSS Style Guide

### BEM Naming Convention

```css
/* ✅ GOOD - BEM structure */
.filter__wrapper { }
.filter__item { }
.filter__item--button { }
.filter__item--active { }
.filter__item__dropdown { }
.filter__item__dropdown--button { }

/* Block__Element--Modifier */

/* ❌ BAD - Inconsistent naming */
.filter-wrapper { }
.filterItem { }
.filter_button { }
```

### SCSS Best Practices

```scss
// ✅ GOOD - Nested selectors (max 3 levels)
.sidebar {
    &__menu {
        &__wrapper {
            padding: 1rem;
        }
        
        &__item {
            color: #333;
            
            &:hover {
                color: #000;
            }
        }
    }
}

// ✅ GOOD - Variables
$primary-color: #007bff;
$secondary-color: #6c757d;
$border-radius: 4px;

// ✅ GOOD - Mixins for reusable styles
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    @include flex-center;
}
```

### CSS Organization

```css
/* 1. Positioning */
position: absolute;
top: 0;
left: 0;
z-index: 10;

/* 2. Box model */
display: flex;
width: 100%;
padding: 1rem;
margin: 0 auto;

/* 3. Typography */
font-size: 1rem;
line-height: 1.5;
color: #333;

/* 4. Visual */
background-color: #fff;
border: 1px solid #ddd;
border-radius: 4px;

/* 5. Other */
cursor: pointer;
transition: all 0.3s ease;
```

## HTML Style Guide

```html
<!-- ✅ GOOD - Semantic HTML -->
<header id="header">
    <nav>
        <ul class="nav__list">
            <li class="nav__item">
                <a href="/" class="nav__link">Trang chủ</a>
            </li>
        </ul>
    </nav>
</header>

<!-- ✅ GOOD - Proper indentation (4 spaces) -->
<div class="container">
    <div class="row">
        <div class="col">
            <p>Content</p>
        </div>
    </div>
</div>

<!-- ✅ GOOD - Data attributes for JS -->
<button 
    class="filter__button" 
    data-type="categories" 
    data-value="sell"
>
    Mua bán
</button>

<!-- ✅ GOOD - Accessibility -->
<img src="/static/logo.png" alt="Logo công ty bất động sản" />
<button aria-label="Đóng modal">
    <i class="fa-solid fa-times"></i>
</button>
```

## File Naming

```
✅ GOOD
- admin_manager_post.js
- locationsDropdown.js
- convertConcurrency.js
- admin_manager_post.css
- base.css

❌ BAD
- AdminManagerPost.js
- locations-dropdown.js
- ConvertConcurrency.js
- Admin Manager Post.css
```

## Git Commit Messages

```bash
# ✅ GOOD - Conventional commits (in English)
feat: add property filtering by price range
fix: resolve login modal not closing issue
docs: update README with setup instructions
style: format code with prettier
refactor: simplify location dropdown logic
test: add validation tests for post form

# ❌ BAD
- updated files
- fix bug
- changes
- thêm tính năng mới (use English)
```

## Code Quality Checklist

- [ ] Không có `console.log` trong production code
- [ ] Không có unused variables/imports
- [ ] Sử dụng `const`/`let` thay vì `var`
- [ ] Sử dụng `===` thay vì `==`
- [ ] Functions có tên rõ ràng và single responsibility
- [ ] Comments giải thích "why" không phải "what"
- [ ] HTML semantic và accessible
- [ ] CSS theo BEM convention
- [ ] Import statements được sắp xếp
- [ ] Code đã format với Prettier
- [ ] ESLint không có errors

