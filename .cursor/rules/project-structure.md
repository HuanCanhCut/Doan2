# Project Structure

## Directory Layout

```
Doan2_Linh/
├── .cursor/
│   └── rules/                    # Cursor rules (this directory)
│       ├── project-overview.md
│       ├── code-style.md
│       ├── project-structure.md
│       ├── development-guidelines.md
│       ├── best-practices.md
│       ├── build-deploy.md
│       └── testing.md
│
├── public/                       # Static assets (không được build/compile)
│   ├── locations/               # Dữ liệu địa điểm (JSON)
│   │   ├── provinces.json
│   │   ├── districts.json
│   │   └── wards.json
│   └── static/                  # Assets tĩnh (images, icons, fonts)
│       ├── logo.png
│       ├── logo-full.png
│       ├── favicon.ico
│       └── images/
│
├── src/                         # Source code
│   ├── js/                      # JavaScript modules
│   │   ├── helpers/            # Utility functions & helpers
│   │   │   ├── convertConcurrency.js
│   │   │   ├── getParentElement.js
│   │   │   └── ...
│   │   │
│   │   ├── admin_manager_post.js    # Admin page logic
│   │   ├── baseModal.js             # Modal base logic
│   │   ├── default.js               # Default layout logic
│   │   ├── details.js               # Details page logic
│   │   ├── editProfile.js           # Edit profile logic
│   │   ├── index.js                 # Homepage logic
│   │   ├── locationsDropdown.js     # Location dropdown component
│   │   ├── login.js                 # Login logic
│   │   ├── post.js                  # Post creation page logic
│   │   ├── popperWrapper.js         # Popper/dropdown wrapper
│   │   ├── register.js              # Registration logic
│   │   ├── sidebar.js               # Sidebar component
│   │   ├── toast.js                 # Toast notification system
│   │   ├── user.js                  # User page logic
│   │   └── Validator.js             # Form validation utility
│   │
│   ├── mocks/                   # Mock data (separated from source)
│   │   ├── posts.js            # Sample posts data
│   │   ├── properties.js       # Sample properties data
│   │   └── users.js            # Sample users data
│   │
│   ├── modal/                   # Modal HTML templates
│   │   ├── loginModal.html
│   │   └── registerModal.html
│   │
│   └── styles/                  # CSS/SCSS files
│       ├── admin_manager_post.scss
│       ├── authModal.css
│       ├── base.css            # Base styles & CSS variables
│       ├── baseModal.css
│       ├── default.css         # Default layout styles
│       ├── details.css
│       ├── editProfile.css
│       ├── grid.css            # Grid system
│       ├── index.css           # Homepage styles
│       ├── normalize.css       # CSS reset/normalize
│       ├── post.css
│       ├── toast.css
│       └── user.css
│
├── node_modules/                # Dependencies (ignored by git)
│
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── eslint.config.mjs           # ESLint configuration
├── package.json                # Project metadata & dependencies
├── vite.config.js              # Vite build configuration
├── yarn.lock                   # Yarn lock file
│
└── *.html                      # HTML entry points (root level)
    ├── index.html              # Homepage/Landing
    ├── default.html            # Default layout template
    ├── post.html               # Create/edit post page
    ├── details.html            # Property details page
    ├── user.html               # User profile page
    └── admin_manager_post.html # Admin management page
```

## File Organization Rules

### 1. HTML Files
**Location**: Root directory (`/`)

```
✅ Đúng:
/index.html
/post.html
/details.html

❌ Sai:
/src/pages/index.html
/pages/post.html
```

**Naming Convention**: `kebab-case.html` hoặc `snake_case.html`

**Purpose**: Entry points cho multi-page application

### 2. JavaScript Files

#### Main Scripts
**Location**: `/src/js/`

```javascript
// ✅ Page-specific scripts
src/js/index.js          // For index.html
src/js/post.js           // For post.html
src/js/details.js        // For details.html
src/js/user.js           // For user.html
src/js/default.js        // For default.html
```

#### Helper Functions
**Location**: `/src/js/helpers/`

```javascript
// ✅ Utility/helper functions
src/js/helpers/convertConcurrency.js
src/js/helpers/getParentElement.js
src/js/helpers/formatDate.js
```

**Quy tắc**:
- Mỗi helper file export một function chính hoặc một object với nhiều related functions
- Tên file nên mô tả chức năng của helper
- Không có side effects khi import

#### Components
**Location**: `/src/js/` (same level as page scripts)

```javascript
// ✅ Reusable components
src/js/sidebar.js
src/js/toast.js
src/js/baseModal.js
src/js/locationsDropdown.js
src/js/popperWrapper.js
```

**Quy tắc**:
- Components là code có thể reuse ở nhiều pages
- Export một object hoặc function chính
- Có thể có internal state

### 3. Mock Data
**Location**: `/src/mocks/`

```javascript
// ✅ Mock data files
src/mocks/posts.js
src/mocks/users.js
src/mocks/properties.js

// ❌ KHÔNG nên mix mock data với source code
src/js/mockData.js        // Bad
src/js/posts/mock.js      // Bad
```

**Format**:
```javascript
// src/mocks/posts.js
export const mockPosts = [
    {
        id: 1,
        title: 'Căn hộ chung cư...',
        // ... more properties
    },
    // ... more posts
]

export default mockPosts
```

### 4. Styles
**Location**: `/src/styles/`

#### Base Styles
```css
src/styles/normalize.css    /* CSS reset */
src/styles/base.css         /* Base styles, variables, utilities */
src/styles/grid.css         /* Grid system */
```

#### Page-specific Styles
```css
src/styles/index.css
src/styles/post.css
src/styles/details.css
src/styles/user.css
src/styles/admin_manager_post.scss
```

#### Component Styles
```css
src/styles/baseModal.css
src/styles/authModal.css
src/styles/toast.css
src/styles/editProfile.css
```

**Naming Convention**: Phải match với tên file HTML hoặc component JS

### 5. Static Assets
**Location**: `/public/static/`

```
public/static/
├── logo.png
├── logo-full.png
├── favicon.ico
├── images/
│   ├── hero-banner.jpg
│   ├── placeholder.png
│   └── ...
├── icons/
│   └── ...
└── fonts/
    └── ...
```

**Access**: Từ HTML dùng absolute path `/static/...`
```html
<img src="/static/logo.png" alt="Logo" />
<link rel="icon" href="/static/favicon.ico" />
```

### 6. Data Files
**Location**: `/public/locations/`

```
public/locations/
├── provinces.json
├── districts.json
└── wards.json
```

**Purpose**: Static data files (JSON, CSV, etc.) cần fetch runtime

## Module System

### Import/Export Patterns

#### Named Exports (Preferred for utilities)
```javascript
// src/js/helpers/formatters.js
export const formatPrice = (price) => { /* ... */ }
export const formatDate = (date) => { /* ... */ }
export const formatAddress = (address) => { /* ... */ }

// Usage
import { formatPrice, formatDate } from './helpers/formatters'
```

#### Default Export (For main object/function)
```javascript
// src/js/toast.js
const toast = {
    show(message) { /* ... */ },
    error(message) { /* ... */ },
    success(message) { /* ... */ }
}

export default toast

// Usage
import toast from './toast'
```

#### App Object Pattern
```javascript
// src/js/index.js
const app = {
    // Data
    posts: [],
    filters: {},
    
    // Methods
    init() { /* ... */ },
    render() { /* ... */ },
    handleEvent() { /* ... */ }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    app.init()
})

export default app
```

## Configuration Files

### Root Level Configs

```
.gitignore           # Git ignore patterns
.prettierrc          # Prettier formatting rules
eslint.config.mjs    # ESLint linting rules
vite.config.js       # Vite build configuration
package.json         # Project metadata & scripts
yarn.lock            # Locked dependency versions
```

**Quy tắc**:
- Các config files phải ở root level
- Không được commit `node_modules/`, `dist/`, `.cursor/`
- Commit `yarn.lock` để đảm bảo consistent dependencies

## Ignored Files & Directories

Theo `.gitignore`:

```bash
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# Editor
.cursor/
.vscode/ (except extensions.json)
.idea/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store

# Environment
*.local
```

## Adding New Files

### Thêm Page mới

1. **Tạo HTML file** ở root:
   ```html
   <!-- contact.html -->
   ```

2. **Tạo JS file** trong `src/js/`:
   ```javascript
   // src/js/contact.js
   ```

3. **Tạo CSS file** trong `src/styles/`:
   ```css
   /* src/styles/contact.css */
   ```

4. **Update vite.config.js**:
   ```javascript
   input: {
       // ... existing entries
       contact: 'contact.html'
   }
   ```

### Thêm Component mới

1. **Tạo JS file** trong `src/js/`:
   ```javascript
   // src/js/myComponent.js
   const myComponent = { /* ... */ }
   export default myComponent
   ```

2. **Tạo CSS file** (nếu cần) trong `src/styles/`:
   ```css
   /* src/styles/myComponent.css */
   ```

3. **Import vào page cần dùng**:
   ```javascript
   import myComponent from './myComponent'
   ```

### Thêm Helper mới

1. **Tạo file** trong `src/js/helpers/`:
   ```javascript
   // src/js/helpers/myHelper.js
   export const myHelper = (param) => { /* ... */ }
   export default myHelper
   ```

2. **Import và sử dụng**:
   ```javascript
   import myHelper from './helpers/myHelper'
   // hoặc
   import { myHelper } from './helpers/myHelper'
   ```

## File Size Guidelines

- **JS files**: < 500 lines (split nếu lớn hơn)
- **CSS files**: < 800 lines (consider splitting by sections)
- **HTML files**: < 1000 lines (use components/includes nếu có thể)
- **JSON data**: < 1MB (consider pagination/splitting)

## Path References

### Trong HTML
```html
<!-- Absolute paths from public -->
<link rel="stylesheet" href="./src/styles/base.css" />
<script type="module" src="./src/js/index.js"></script>
<img src="/static/logo.png" alt="Logo" />

<!-- Font Awesome CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/..." />
```

### Trong JavaScript
```javascript
// Relative imports
import helper from './helpers/myHelper'
import component from './toast'

// Fetch data from public
const response = await fetch('/locations/provinces.json')
```

### Trong CSS
```css
/* Background images from public */
.hero {
    background-image: url('/static/images/hero.jpg');
}

/* Fonts from public */
@font-face {
    src: url('/static/fonts/custom.woff2');
}
```

## Best Practices

✅ **DO**:
- Giữ structure phẳng, tránh nested quá sâu
- Group files theo chức năng/feature
- Tách mock data ra khỏi source code
- Đặt tên files rõ ràng, mô tả chức năng
- Một file một responsibility chính

❌ **DON'T**:
- Mix mock data với production code
- Tạo deep nested folders không cần thiết
- Đặt config files trong subfolders
- Duplicate code thay vì reuse components
- Tạo "utils" folder chứa mọi thứ

