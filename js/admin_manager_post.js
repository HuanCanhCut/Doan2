import handleConvertPrice from './helpers/handleConvertPrice.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import middleware from './middleware.js'

await middleware()

const searchInput = document.getElementById('search-input')
const resetBtn = document.getElementById('reset-btn')
const statusFilter = document.getElementById('status-filter')
const typeFilter = document.getElementById('type-filter')
const categoryFilter = document.getElementById('category-filter')
const postsTableBody = document.querySelector('#posts-table-body')

let currentPost = JSON.parse(localStorage.getItem('posts')) || []

let selectedPost = []

let filterState = {
    search: '',
    status: 'all',
    type: 'all',
    category: 'all',
}
//Hàm handleLoadOverview dùng để hiển thị thống kê tổng quan bài đăng
function handleLoadOverview(posts) {
    const overview = [
        {
            label: 'Tổng số tin đăng',
            value: () => posts.length,
            icon: 'fa-solid fa-mobile-screen',
            color: 'var(--accent)',
            backgroundColor: '#ffaa7d2e',
        },
        {
            label: 'Đã duyệt',
            value: () => posts.filter((post) => post.post_status === 'approved').length,
            icon: 'fa-solid fa-circle-check',
            color: 'var(--success)',
            backgroundColor: '#0bb07924',
        },
        {
            label: 'Chờ duyệt',
            value: () => posts.filter((post) => post.post_status === 'pending').length,
            icon: 'fa-solid fa-clock',
            color: '#f59e0b',
            backgroundColor: '#f59f0b28',
        },
        {
            label: 'Bị từ chối',
            value: () => posts.filter((post) => post.post_status === 'rejected').length,
            icon: 'fa-solid fa-ban',
            color: '#ff3434ff',
            backgroundColor: '#ff343424',
        },
    ]

    document.querySelector('.overview__container').innerHTML = overview
        .map((item) => {
            return `
                <div class="col col-12 sm:col-6 lg:col-4 md:col-6 xl:col-3">
                    <div class="analytics__item">
                        <div
                            class="analytics__item--icon"
                            style="color: ${item.color}; background-color: ${item.backgroundColor}"
                        >
                            <i class="${item.icon}"></i>
                        </div>
                        <div>
                            <span class="analytics__item--title">${item.label}</span>
                            <h1 style="font-size: 2.8rem; font-weight: 700; margin: 12px auto">${item.value()}</h1>
                        </div>
                    </div>
                </div>
            `
        })
        .join('')
}

function handleLoadPosts(posts) {
    const projectTypeMapping = {
        sell: 'Bán',
        rent: 'Cho thuê',
    }

    const statusMapping = {
        pending: 'Chờ duyệt',
        approved: 'Đã duyệt',
        rejected: 'Bị từ chối',
    }

    const categories = JSON.parse(localStorage.getItem('categories')) || []

    postsTableBody.innerHTML = posts
        .map((post, index) => {
            return `
            <tr>
                <td>
                    <input data-id=${post.id} type="checkbox" class="post-checkbox" ${
                selectedPost.includes(post.id) ? 'checked' : ''
            }/>
                </td>
                <td>${index + 1}</td>
                <td>
                    <div class="post__title">${post.title}</div>
                    <small style="color: #999; font-size: 1.2rem">${post.address_bd}</small>
                </td>
                <td>
                    <span style="${
                        post.project_type === 'sell'
                            ? 'background: #e3f2fd; color: #2196f3'
                            : 'background: #f3e5f5; color: #9c27b0'
                    }" class="post__category">
                    ${projectTypeMapping[post.project_type]}-${
                categories.find((category) => category.key === post.property_category)?.name
            }</span>
                </td>
                <td>
                    <span class="post__price">${handleConvertPrice(post.detail.price.toString())}</span>
                </td>
                <td>
                    <span class="post__status" style="${
                        post.post_status === 'approved'
                            ? 'background: #e8f5e9; color: #4caf50'
                            : post.post_status === 'pending'
                            ? 'background: #fff3e0; color: #ff9800'
                            : 'background: #ffebee; color: #f44336'
                    }">${statusMapping[post.post_status]}</span>
                </td>
                <td>
                    <span class="post__date">${momentTimezone(post.created_at)}</span>
                </td>
                <td>
                    <div class="table__actions">
                    <button 
                            class="action__btn action__btn--approve"
                            data-action="approve"
                            data-id="${post.id}"
                            title="Duyệt"
                        >
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button
                            class="action__btn action__btn--pending"
                            data-action="pending"
                            data-id="${post.id}"
                            title="Chờ duyệt"
                        >
                            <i class="fa-solid fa-hourglass-end"></i>
                        </button>
                        <button
                            class="action__btn action__btn--reject"
                            data-action="reject"
                            data-id="${post.id}"
                            title="Từ chối"
                        >
                            <i class="fa-solid fa-times"></i>
                        </button>
                        <button
                            class="action__btn action__btn--delete"
                            data-action="delete"
                            data-id="${post.id}"
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

    count.textContent = `${currentPost.length}/${JSON.parse(localStorage.getItem('posts')).length}`
}

//Hàm handleFilter dùng để lọc danh sách bài đăng theo các điều kiện
function handleFilter() {
    currentPost = JSON.parse(localStorage.getItem('posts')).filter((post) => {
        const searchMatch =
            !filterState.search ||
            post.title.toLowerCase().includes(filterState.search.toLocaleLowerCase()) ||
            post.address.toLowerCase().includes(filterState.search.toLocaleLowerCase()) ||
            post.address_bd.toLowerCase().includes(filterState.search.toLocaleLowerCase())

        const statusMatch = filterState.status === 'all' || post.post_status === filterState.status

        const typeMatch = filterState.type === 'all' || post.project_type === filterState.type

        const categoryMatch = filterState.category === 'all' || post.property_category === filterState.category

        return searchMatch && statusMatch && typeMatch && categoryMatch
    })

    return currentPost
}
// Hàm handleApplyFilter dùng để áp dụng bộ lọc khi người dùng thay đổi input
function handleApplyFilter(e, key) {
    const value = e.target.value

    filterState[key] = value

    const filtered = handleFilter()

    handleLoadPosts(filtered)
}
// Tìm kiếm theo từ khóa (gõ đến đâu lọc đến đó)
searchInput.oninput = (e) => {
    handleApplyFilter(e, 'search')
}

statusFilter.onchange = (e) => {
    handleApplyFilter(e, 'status')
}

typeFilter.onchange = (e) => {
    handleApplyFilter(e, 'type')
}

categoryFilter.onchange = (e) => {
    handleApplyFilter(e, 'category')
}

resetBtn.onclick = () => {
    filterState = {
        search: '',
        status: 'all',
        type: 'all',
        category: 'all',
    }

    Array.from([statusFilter, typeFilter, categoryFilter]).forEach((select) => {
        select.value = 'all'
    })

    searchInput.value = ''

    const filtered = handleFilter()

    handleLoadPosts(filtered)
    handleLoadOverview(filtered)
}

postsTableBody.onclick = (e) => {
    // handle when click action btn
    const isMatchBtn = e.target.closest('.action__btn')

    // handle when click action btn
    if (isMatchBtn) {
        const postId = isMatchBtn.dataset.id

        const post = currentPost.find((post) => post.id === Number(postId))
        //Chỉ cho thao tác khi bài đó đang được tick chọn (đảm bảo đúng flow chọn nhiều)
        if (!selectedPost.includes(Number(postId))) {
            return
        }

        let isConfirm = false
        let typeConfirm = ''

        switch (isMatchBtn.dataset.action) {
            case 'approve':
                // không xử lí duyệt cho các bài đăng đã duyệt
                if (post.post_status === 'approved' && selectedPost.length === 0) {
                    return
                }

                if (confirm(`Bạn có chắc chắn muốn duyệt bài đăng này không?`)) {
                    isConfirm = true
                    typeConfirm = 'approved'
                }

                break
            case 'pending':
                if (post.post_status === 'pending' && selectedPost.length === 0) {
                    return
                }

                if (confirm(`Bạn có chắc chắn muốn chuyển bài đăng này sang trạng thái chờ duyệt không?`)) {
                    isConfirm = true
                    typeConfirm = 'pending'
                }

                break
            case 'reject':
                if (post.post_status === 'rejected' && selectedPost.length === 0) {
                    return
                }

                if (confirm(`Bạn có chắc chắn muốn từ chối bài đăng này không?`)) {
                    isConfirm = true
                    typeConfirm = 'rejected'
                }

                break
            case 'delete':
                if (confirm(`Bạn có chắc chắn muốn xóa bài đăng này không?`)) {
                    localStorage.setItem(
                        'posts',
                        JSON.stringify(
                            JSON.parse(localStorage.getItem('posts'))?.filter((p) => p.id !== Number(postId))
                        )
                    )

                    currentPost = currentPost.filter((p) => p.id !== Number(postId))

                    handleLoadPosts(currentPost)

                    handleLoadOverview(JSON.parse(localStorage.getItem('posts')) || [])
                }
                break
        }

        if (isConfirm) {
            currentPost = currentPost.map((p) => {
                if (selectedPost.includes(p.id)) {
                    return {
                        ...p,
                        post_status: typeConfirm,
                    }
                }

                return p
            })

            localStorage.setItem(
                'posts',
                JSON.stringify(
                    JSON.parse(localStorage.getItem('posts'))?.map((p) => {
                        if (selectedPost.includes(p.id)) {
                            return {
                                ...p,
                                post_status: typeConfirm,
                            }
                        }

                        return p
                    })
                )
            )

            selectedPost = []

            document.querySelector('#select-all').checked = false

            handleLoadPosts(currentPost)

            handleLoadOverview(JSON.parse(localStorage.getItem('posts')) || [])
        }
    }

    // handle when click post checkbox
    if (e.target.closest('.post-checkbox')) {
        const postId = Number(e.target.closest('.post-checkbox').dataset.id)

        if (!postId) {
            return
        }

        if (selectedPost.includes(postId)) {
            selectedPost = selectedPost.filter((selected) => selected !== postId)
        } else {
            selectedPost.push(Number(postId))
        }

        handleLoadPosts(currentPost)
    }
}

document.querySelector('#select-all').onchange = (e) => {
    if (e.target.checked) {
        // Nếu chọn tất cả → thêm toàn bộ id bài đăng vào selectedPost
        JSON.parse(localStorage.getItem('posts')).forEach((post) => {
            selectedPost.push(post.id)
        })
    } else {
        selectedPost = []
    }
    handleLoadPosts(currentPost)
}
// Hàm handleLoadCategories dùng để render danh sách danh mục vào bộ lọc
function handleLoadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || []

    categoryFilter.innerHTML = categories
        .map((category, index) => {
            return `
                ${index === 0 ? '<option value="all">Tất cả danh mục</option>' : ''}

                <option value="${category.key}">Bất động sản - ${category.name}</option>
            `
        })
        .join('')
}

handleLoadCategories()

handleLoadPosts(currentPost)
handleLoadOverview(currentPost)
