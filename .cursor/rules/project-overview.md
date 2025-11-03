# Project Overview - Real Estate Platform

## Thông tin dự án

**Tên dự án**: Doan2_Linh - Nền tảng Bất Động Sản  
**Phiên bản**: 0.0.0  
**Loại dự án**: Web Application (Multi-page)  
**Ngôn ngữ UI**: Tiếng Việt  
**Ngôn ngữ commit**: Tiếng Anh

## Mô tả

Đây là một nền tảng quản lý và mua bán bất động sản được xây dựng với Vanilla JavaScript và Vite. Ứng dụng cho phép người dùng:

-   🏠 Duyệt và tìm kiếm các bất động sản
-   🔍 Lọc theo nhiều tiêu chí (loại hình, giá, khu vực)
-   📝 Đăng tin rao bất động sản
-   👤 Quản lý thông tin cá nhân
-   ⭐ Lưu các tin yêu thích
-   🔐 Đăng nhập/Đăng ký tài khoản
-   👨‍💼 Phân biệt giữa người dùng cá nhân và môi giới

## Technology Stack

### Core Technologies

-   **JavaScript**: ES6+ Modules (Vanilla JS - No Framework)
-   **Build Tool**: Vite 7.1.2
-   **Styling**: SCSS/SASS + CSS
-   **Package Manager**: Yarn (preferred)

### Development Tools

-   **Linter**: ESLint 9.35.0
-   **Formatter**: Prettier (integrated with ESLint)
-   **Import Sorting**: eslint-plugin-simple-import-sort

### Dependencies

```json
{
    "devDependencies": {
        "@eslint/js": "^9.35.0",
        "eslint": "^9.35.0",
        "eslint-config-prettier": "^10.1.8",
        "eslint-plugin-prettier": "^5.5.4",
        "eslint-plugin-simple-import-sort": "^12.1.1",
        "sass-embedded": "^1.92.1",
        "vite": "^7.1.2",
        "scss": "^0.2.4"
    }
}
```

## Kiến trúc ứng dụng

### Multi-page Application (MPA)

Dự án sử dụng kiến trúc MPA với các trang riêng biệt:

1. **index.html** - Trang chủ/Landing page
2. **default.html** - Layout mặc định
3. **post.html** - Trang đăng tin
4. **details.html** - Chi tiết bất động sản
5. **user.html** - Trang người dùng
6. **admin_manager_post.html** - Quản lý tin đăng (Admin)

### State Management

-   **LocalStorage**: Lưu trữ dữ liệu persistent
-   **App Objects**: Quản lý state cho từng page
-   **Mock Data**: Data mẫu trong `src/mocks/`

## Tính năng chính

### 1. Tìm kiếm và Lọc

-   Lọc theo loại giao dịch (Mua bán/Cho thuê)
-   Lọc theo loại bất động sản (Căn hộ/Nhà/Đất/Phòng)
-   Lọc theo khoảng giá
-   Lọc theo vị trí (Tỉnh/Thành > Quận/Huyện > Phường/Xã)
-   Lọc theo loại người đăng (Cá nhân/Môi giới)

### 2. Quản lý Bài đăng

-   Tạo tin đăng mới với form validation
-   Upload hình ảnh
-   Quản lý tin đã đăng
-   Chỉnh sửa/Xóa tin

### 3. Người dùng

-   Đăng nhập/Đăng ký
-   Xem và chỉnh sửa thông tin cá nhân
-   Quản lý tin yêu thích
-   Phân quyền (User/Agent/Admin)

### 4. UI/UX

-   Responsive design
-   Modal system cho authentication
-   Toast notifications
-   Location dropdown với hierarchy
-   Sidebar navigation
-   Filter popovers

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Performance Considerations

-   Vite's fast HMR (Hot Module Replacement)
-   Code splitting per page
-   Lazy loading where applicable
-   LocalStorage for data persistence (offline capability)

## Security Notes

-   Client-side validation (Validator.js)
-   Prepared for server-side integration
-   XSS protection through proper DOM manipulation
-   Data sanitization before storage

## Future Enhancements

-   [ ] Backend API integration
-   [ ] Real-time updates
-   [ ] Advanced search with Elasticsearch
-   [ ] Map integration for location
-   [ ] Payment gateway integration
-   [ ] Email notifications
-   [ ] Image optimization and CDN
-   [ ] PWA capabilities
