import toast from './toast'
import mockPosts from '../mocks/posts'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency'
import { momentTimezone } from './helpers/momentTimezone'

const postsTableBody = document.querySelector('#posts-table-body')
const searchInput = document.querySelector('#search-input')
const statusFilter = document.querySelector('#status-filter')
const typeFilter = document.querySelector('#type-filter')
const categoryFilter = document.querySelector('#category-filter')
const refreshBtn = document.querySelector('#refresh-btn')
const selectAllCheckbox = document.querySelector('#select-all')
const emptyState = document.querySelector('#empty-state')
const modal = document.querySelector('#post-detail-modal')
const modalBody = document.querySelector('#modal-body')
const closeModalBtn = document.querySelector('#close-modal')
const headerToggle = document.querySelector('.header__toggle')
const sidebar = document.querySelector('.sidebar')
const logoutBtn = document.querySelector('.sidebar__logout')
const bulkActionsBar = document.querySelector('#bulk-actions')
const selectedCountSpan = document.querySelector('#selected-count')
const bulkApproveBtn = document.querySelector('#bulk-approve-btn')
const bulkRejectBtn = document.querySelector('#bulk-reject-btn')
const bulkDeleteBtn = document.querySelector('#bulk-delete-btn')

let allPosts = []
let filteredPosts = []
let currentFilters = {
    search: '',
    status: 'all',
    type: 'all',
    category: 'all',
}

const loadPosts = () => {
    try {
        const storedPosts = localStorage.getItem('posts')
        if (storedPosts) {
            allPosts = JSON.parse(storedPosts)
        } else {
            allPosts = [...mockPosts]
            localStorage.setItem('posts', JSON.stringify(allPosts))
        }
    } catch (error) {
        console.error('Error loading posts:', error)
        allPosts = [...mockPosts]
        toast({
            title: 'Lỗi',
            message: 'Không thể tải dữ liệu từ localStorage',
            type: 'error',
        })
    }
}

const savePosts = () => {
    try {
        localStorage.setItem('posts', JSON.stringify(allPosts))
        return true
    } catch (error) {
        console.error('Error saving posts:', error)
        toast({
            title: 'Lỗi',
            message: 'Không thể lưu dữ liệu',
            type: 'error',
        })
        return false
    }
}

const updateStats = () => {
    const totalPosts = allPosts.length
    const pendingPosts = allPosts.filter((p) => p.post_status === 'pending').length
    const approvedPosts = allPosts.filter((p) => p.post_status === 'approved').length
    const rejectedPosts = allPosts.filter((p) => p.post_status === 'rejected').length

    document.querySelector('#total-posts').textContent = totalPosts
    document.querySelector('#pending-posts').textContent = pendingPosts
    document.querySelector('#approved-posts').textContent = approvedPosts
    document.querySelector('#rejected-posts').textContent = rejectedPosts
}

const applyFilters = () => {
    filteredPosts = allPosts.filter((post) => {
        const searchMatch =
            !currentFilters.search ||
            post.title.toLowerCase().includes(currentFilters.search) ||
            post.address.toLowerCase().includes(currentFilters.search) ||
            post.address_bd.toLowerCase().includes(currentFilters.search)

        const statusMatch = currentFilters.status === 'all' || post.post_status === currentFilters.status

        const typeMatch = currentFilters.type === 'all' || post.project_type === currentFilters.type

        const categoryMatch = currentFilters.category === 'all' || post.property_category === currentFilters.category

        return searchMatch && statusMatch && typeMatch && categoryMatch
    })

    renderPosts()
    updateTableInfo()
}

const formatPrice = (price) => {
    const numPrice = Number(price)
    if (numPrice >= 1000000000) {
        return `${(numPrice / 1000000000).toFixed(1)} tỷ`
    } else if (numPrice >= 1000000) {
        return `${(numPrice / 1000000).toFixed(1)} triệu`
    } else {
        return `${convertConcurrencyToNumber(numPrice)} VNĐ`
    }
}

const getCategoryName = (category) => {
    const categories = {
        apartment: 'Chung cư',
        house: 'Nhà riêng',
        land: 'Đất nền',
        room: 'Phòng trọ',
    }
    return categories[category] || category
}

const getStatusName = (status) => {
    const statuses = {
        pending: 'Chờ duyệt',
        approved: 'Đã duyệt',
        rejected: 'Bị từ chối',
    }
    return statuses[status] || status
}

const renderPosts = () => {
    if (!postsTableBody) return

    if (filteredPosts.length === 0) {
        emptyState.style.display = 'block'
        postsTableBody.closest('.table__container').style.display = 'none'
        return
    } else {
        emptyState.style.display = 'none'
        postsTableBody.closest('.table__container').style.display = 'block'
    }

    postsTableBody.innerHTML = filteredPosts
        .map((post) => {
            const statusClass = `post__status--${post.post_status}`
            const categoryClass = `post__category--${post.project_type}`

            return `
                <tr data-post-id="${post.id}">
                    <td>
                        <input type="checkbox" class="post-checkbox" data-post-id="${post.id}" />
                    </td>
                    <td>#${post.id}</td>
                    <td>
                        <div class="post__title">${post.title}</div>
                        <small style="color: #999; font-size: 1.2rem;">${post.address_bd}</small>
                    </td>
                    <td>
                        <span class="post__category ${categoryClass}">
                            ${post.project_type === 'sell' ? 'Bán' : 'Cho thuê'} - ${getCategoryName(
                post.property_category
            )}
                        </span>
                    </td>
                    <td>
                        <span class="post__price">${formatPrice(post.detail.price)}</span>
                    </td>
                    <td>
                        <span class="post__status ${statusClass}">
                            ${getStatusName(post.post_status)}
                        </span>
                    </td>
                    <td>
                        <span class="post__date">${momentTimezone(post.created_at)}</span>
                    </td>
                    <td>
                        <div class="table__actions">
                            <button 
                                class="action__btn action__btn--view" 
                                data-action="view" 
                                data-post-id="${post.id}"
                                title="Xem chi tiết"
                            >
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button 
                                class="action__btn action__btn--approve" 
                                data-action="approve" 
                                data-post-id="${post.id}"
                                title="Duyệt"
                            >
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button 
                                class="action__btn action__btn--reject" 
                                data-action="reject" 
                                data-post-id="${post.id}"
                                title="Từ chối"
                            >
                                <i class="fa-solid fa-times"></i>
                            </button>
                            <button 
                                class="action__btn action__btn--delete" 
                                data-action="delete" 
                                data-post-id="${post.id}"
                                title="Xóa"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
        })
        .join('')
}

const updateTableInfo = () => {
    const showingCount = document.querySelector('#showing-count')
    const totalCount = document.querySelector('#total-count')

    if (showingCount) {
        showingCount.textContent = filteredPosts.length
    }
    if (totalCount) {
        totalCount.textContent = allPosts.length
    }
}

const viewPost = (postId) => {
    const post = allPosts.find((p) => p.id === postId)
    if (!post) return

    modalBody.innerHTML = `
        <div class="modal__images">
            ${post.images
                .map(
                    (img) => `
                <img src="${img}" alt="${post.title}" class="modal__image" onerror="this.src='/static/fallback.png'" />
            `
                )
                .join('')}
        </div>
        
        <div class="modal__info">
            <div class="modal__info__item">
                <span class="modal__info__label">ID:</span>
                <span class="modal__info__value">#${post.id}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Tiêu đề:</span>
                <span class="modal__info__value">${post.title}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Địa chỉ:</span>
                <span class="modal__info__value">${post.address}, ${post.address_bd}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Loại:</span>
                <span class="modal__info__value">
                    ${post.project_type === 'sell' ? 'Bán' : 'Cho thuê'} - ${getCategoryName(post.property_category)}
                </span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Giá:</span>
                <span class="modal__info__value" style="color: var(--primary); font-weight: 600;">
                    ${formatPrice(post.detail.price)}
                </span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Diện tích:</span>
                <span class="modal__info__value">${post.detail.area} m²</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Phòng ngủ:</span>
                <span class="modal__info__value">${post.detail.bedrooms}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Phòng tắm:</span>
                <span class="modal__info__value">${post.detail.bathrooms}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Hướng ban công:</span>
                <span class="modal__info__value">${post.detail.balcony}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Hướng cửa chính:</span>
                <span class="modal__info__value">${post.detail.main_door}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Giấy tờ pháp lý:</span>
                <span class="modal__info__value">${post.detail.legal_documents}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Tình trạng nội thất:</span>
                <span class="modal__info__value">${post.detail.interior_status}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Người đăng:</span>
                <span class="modal__info__value">${post.role === 'agent' ? 'Môi giới' : 'Cá nhân'}</span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Trạng thái:</span>
                <span class="modal__info__value">
                    <span class="post__status post__status--${post.post_status}">
                        ${getStatusName(post.post_status)}
                    </span>
                </span>
            </div>
            <div class="modal__info__item">
                <span class="modal__info__label">Ngày đăng:</span>
                <span class="modal__info__value">${momentTimezone(post.created_at)}</span>
            </div>
        </div>
        
        <div class="modal__description">
            <h3>Mô tả chi tiết</h3>
            <p>${post.description}</p>
        </div>
        
        <div class="modal__actions">
            <button class="btn btn--primary" data-action="approve-modal" data-post-id="${post.id}">
                <i class="fa-solid fa-check"></i>
                Duyệt tin
            </button>
            <button class="btn btn--outline" data-action="reject-modal" data-post-id="${
                post.id
            }" style="border-color: #ff9800; color: #ff9800;">
                <i class="fa-solid fa-times"></i>
                Từ chối
            </button>
            <button class="btn btn--outline" data-action="delete-modal" data-post-id="${
                post.id
            }" style="border-color: #f44336; color: #f44336;">
                <i class="fa-solid fa-trash"></i>
                Xóa tin
            </button>
        </div>
    `

    openModal()
}

const approvePost = (postId) => {
    const post = allPosts.find((p) => p.id === postId)
    if (!post) return

    const statusText = post.post_status === 'approved' ? 'Tin đăng này đã được duyệt rồi.' : ''
    const confirmMessage = statusText
        ? `${statusText} Bạn vẫn muốn duyệt lại tin "${post.title}"?`
        : `Bạn có chắc chắn muốn duyệt tin "${post.title}"?`

    if (confirm(confirmMessage)) {
        post.post_status = 'approved'
        post.updated_at = new Date()

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: 'Đã duyệt tin đăng',
                type: 'success',
            })

            updateStats()
            applyFilters()
        }
    }
}

const rejectPost = (postId) => {
    const post = allPosts.find((p) => p.id === postId)
    if (!post) return

    const statusText = post.post_status === 'rejected' ? 'Tin đăng này đã bị từ chối rồi.' : ''
    const confirmMessage = statusText
        ? `${statusText} Bạn vẫn muốn từ chối lại tin "${post.title}"?`
        : `Bạn có chắc chắn muốn từ chối tin "${post.title}"?`

    if (confirm(confirmMessage)) {
        post.post_status = 'rejected'
        post.updated_at = new Date()

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: 'Đã từ chối tin đăng',
                type: 'warning',
            })

            updateStats()
            applyFilters()
        }
    }
}

const deletePost = (postId) => {
    const post = allPosts.find((p) => p.id === postId)
    if (!post) return

    if (confirm(`Bạn có chắc chắn muốn xóa tin "${post.title}"? Hành động này không thể hoàn tác!`)) {
        allPosts = allPosts.filter((p) => p.id !== postId)

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: 'Đã xóa tin đăng',
                type: 'success',
            })

            updateStats()
            applyFilters()
        }
    }
}

const getSelectedPostIds = () => {
    const checkboxes = document.querySelectorAll('.post-checkbox:checked')
    return Array.from(checkboxes).map((cb) => parseInt(cb.dataset.postId))
}

const updateBulkActionsBar = () => {
    const selectedIds = getSelectedPostIds()
    const selectedCount = selectedIds.length

    if (selectedCount > 0) {
        bulkActionsBar.style.display = 'flex'
        selectedCountSpan.textContent = selectedCount
    } else {
        bulkActionsBar.style.display = 'none'
    }

    const allCheckboxes = document.querySelectorAll('.post-checkbox')
    const checkedCheckboxes = document.querySelectorAll('.post-checkbox:checked')

    if (allCheckboxes.length > 0) {
        selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length
        // set indeterminate state if some checkboxes are checked but not all
        selectAllCheckbox.indeterminate =
            checkedCheckboxes.length > 0 && checkedCheckboxes.length < allCheckboxes.length
    }
}

const handleSelectAll = (checked) => {
    const checkboxes = document.querySelectorAll('.post-checkbox')
    checkboxes.forEach((cb) => {
        cb.checked = checked
    })
    updateBulkActionsBar()
}

const bulkApprovePosts = () => {
    const selectedIds = getSelectedPostIds()
    if (selectedIds.length === 0) return

    if (confirm(`Bạn có chắc chắn muốn duyệt ${selectedIds.length} tin đăng đã chọn?`)) {
        selectedIds.forEach((id) => {
            const post = allPosts.find((p) => p.id === id)
            if (post) {
                post.post_status = 'approved'
                post.updated_at = new Date()
            }
        })

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: `Đã duyệt ${selectedIds.length} tin đăng`,
                type: 'success',
            })

            updateStats()
            applyFilters()
            updateBulkActionsBar()
        }
    }
}

const bulkRejectPosts = () => {
    const selectedIds = getSelectedPostIds()
    if (selectedIds.length === 0) return

    if (confirm(`Bạn có chắc chắn muốn từ chối ${selectedIds.length} tin đăng đã chọn?`)) {
        selectedIds.forEach((id) => {
            const post = allPosts.find((p) => p.id === id)
            if (post) {
                post.post_status = 'rejected'
                post.updated_at = new Date()
            }
        })

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: `Đã từ chối ${selectedIds.length} tin đăng`,
                type: 'warning',
            })

            updateStats()
            applyFilters()
            updateBulkActionsBar()
        }
    }
}

const bulkDeletePosts = () => {
    const selectedIds = getSelectedPostIds()
    if (selectedIds.length === 0) return

    if (
        confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tin đăng đã chọn? Hành động này không thể hoàn tác!`)
    ) {
        allPosts = allPosts.filter((p) => !selectedIds.includes(p.id))

        if (savePosts()) {
            toast({
                title: 'Thành công',
                message: `Đã xóa ${selectedIds.length} tin đăng`,
                type: 'success',
            })

            updateStats()
            applyFilters()
            updateBulkActionsBar()
        }
    }
}

const refreshData = () => {
    currentFilters = {
        search: '',
        status: 'all',
        type: 'all',
        category: 'all',
    }

    searchInput.value = ''
    statusFilter.value = 'all'
    typeFilter.value = 'all'
    categoryFilter.value = 'all'

    loadPosts()
    updateStats()
    applyFilters()

    toast({
        title: 'Thành công',
        message: 'Đã làm mới dữ liệu',
        type: 'success',
    })
}

const openModal = () => {
    modal?.classList.add('active')
    document.body.style.overflow = 'hidden'
}

const closeModal = () => {
    modal?.classList.remove('active')
    document.body.style.overflow = ''
}

const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('currentUser')

        toast({
            title: 'Đăng xuất',
            message: 'Đã đăng xuất thành công',
            type: 'success',
        })

        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }
}

let searchTimeout
searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        currentFilters.search = e.target.value.toLowerCase().trim()
        applyFilters()
    }, 300)
})

statusFilter?.addEventListener('change', (e) => {
    currentFilters.status = e.target.value
    applyFilters()
})

typeFilter?.addEventListener('change', (e) => {
    currentFilters.type = e.target.value
    applyFilters()
})

categoryFilter?.addEventListener('change', (e) => {
    currentFilters.category = e.target.value
    applyFilters()
})

refreshBtn?.addEventListener('click', () => {
    refreshData()
})

selectAllCheckbox?.addEventListener('change', (e) => {
    handleSelectAll(e.target.checked)
})

postsTableBody?.addEventListener('change', (e) => {
    if (e.target.classList.contains('post-checkbox')) {
        updateBulkActionsBar()
    }
})

bulkApproveBtn?.addEventListener('click', () => {
    bulkApprovePosts()
})

bulkRejectBtn?.addEventListener('click', () => {
    bulkRejectPosts()
})

bulkDeleteBtn?.addEventListener('click', () => {
    bulkDeletePosts()
})

closeModalBtn?.addEventListener('click', () => {
    closeModal()
})

modal?.querySelector('.modal__overlay')?.addEventListener('click', () => {
    closeModal()
})

postsTableBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('.action__btn')
    if (!btn) return

    const postId = parseInt(btn.dataset.postId)
    const action = btn.dataset.action

    switch (action) {
        case 'view':
            viewPost(postId)
            break
        case 'approve':
            approvePost(postId)
            break
        case 'reject':
            rejectPost(postId)
            break
        case 'delete':
            deletePost(postId)
            break
    }
})

modalBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]')
    if (!btn) return

    const postId = parseInt(btn.dataset.postId)
    const action = btn.dataset.action

    switch (action) {
        case 'approve-modal':
            approvePost(postId)
            closeModal()
            break
        case 'reject-modal':
            rejectPost(postId)
            closeModal()
            break
        case 'delete-modal':
            deletePost(postId)
            closeModal()
            break
    }
})

headerToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('show')
    document.querySelector('#overlay')?.classList.toggle('active')
})

document.querySelector('#overlay')?.addEventListener('click', () => {
    sidebar?.classList.remove('show')
    document.querySelector('#overlay')?.classList.remove('active')
})

logoutBtn?.addEventListener('click', () => {
    handleLogout()
})

loadPosts()
updateStats()
applyFilters()
