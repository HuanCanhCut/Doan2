import handleConvertPrice from './helpers/handleConvertPrice.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import middleware from './middleware.js'
import * as analyticsServices from './services/analyticsService.js'
import * as managerPostServices from './services/managerPostService.js'
import * as categoryServices from './services/categoryService.js'

await middleware()

const searchInput = document.getElementById('search-input')
const resetBtn = document.getElementById('reset-btn')
const statusFilter = document.getElementById('status-filter')
const typeFilter = document.getElementById('type-filter')
const categoryFilter = document.getElementById('category-filter')
const postsTableBody = document.querySelector('#posts-table-body')

const PER_PAGE = 10

let { data: currentPosts, meta } = await analyticsServices.getPostsManager({ params: { page: 1, per_page: PER_PAGE } })
const { data: categories } = await categoryServices.getCategories()

let selectedPost = []

let filterState = {
    search: '',
    post_status: 'all',
    project_type: 'all',
    category_id: 0,
}
//Hàm handleLoadOverview dùng để hiển thị thống kê tổng quan bài đăng
async function handleLoadOverview() {
    const { data: overviewData } = await analyticsServices.getPostsAnalyticsOverview()

    const overview = [
        {
            label: 'Tổng số tin đăng',
            value: () => overviewData.total,
            icon: 'fa-solid fa-mobile-screen',
            color: 'var(--accent)',
            backgroundColor: '#ffaa7d2e',
        },
        {
            label: 'Đã duyệt',
            value: () => overviewData.approved_count,
            icon: 'fa-solid fa-circle-check',
            color: 'var(--success)',
            backgroundColor: '#0bb07924',
        },
        {
            label: 'Chờ duyệt',
            value: () => overviewData.pending_count,
            icon: 'fa-solid fa-clock',
            color: '#f59e0b',
            backgroundColor: '#f59f0b28',
        },
        {
            label: 'Bị từ chối',
            value: () => overviewData.rejected_count,
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
                    <small style="color: #999; font-size: 1.2rem">${post.administrative_address}</small>
                </td>
                <td>
                    <span style="${
                        post.project_type === 'sell'
                            ? 'background: #e3f2fd; color: #2196f3'
                            : 'background: #f3e5f5; color: #9c27b0'
                    }" class="post__category">
                    ${projectTypeMapping[post.project_type]}-${
                categories.find((category) => category.id === post.category_id)?.name
            }</span>
                </td>
                <td>
                    <span class="post__price">${handleConvertPrice(Number(post.json_post_detail.price))}</span>
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

    count.textContent = `${currentPosts.length}/${meta.pagination.total}`
}

//Hàm handleFilter dùng để lọc danh sách bài đăng theo các điều kiện
async function handleFilter() {
    currentPosts = await analyticsServices.getPostsManager({
        params: { page: meta.pagination.current_page, per_page: PER_PAGE, ...filterState },
    })

    return currentPosts
}
// Hàm handleApplyFilter dùng để áp dụng bộ lọc khi người dùng thay đổi input
async function handleApplyFilter(e, key) {
    const value = e.target.value

    filterState[key] = value

    const { data: filtered } = await handleFilter()

    handleLoadPosts(filtered)
}

// Tìm kiếm theo từ khóa (gõ đến đâu lọc đến đó)
searchInput.oninput = async (e) => {
    await handleApplyFilter(e, 'search')
}

statusFilter.onchange = async (e) => {
    await handleApplyFilter(e, 'post_status')
}

typeFilter.onchange = async (e) => {
    await handleApplyFilter(e, 'project_type')
}

categoryFilter.onchange = async (e) => {
    await handleApplyFilter(e, 'category_id')
}

resetBtn.onclick = async () => {
    filterState = {
        search: '',
        post_status: 'all',
        project_type: 'all',
        category_id: 0,
    }

    Array.from([statusFilter, typeFilter, categoryFilter]).forEach((select) => {
        select.value = 'all'
    })

    searchInput.value = ''

    const { data: filtered } = await handleFilter()

    handleLoadPosts(filtered)
    handleLoadOverview(filtered)
}

postsTableBody.onclick = async (e) => {
    // handle when click action btn
    const isMatchBtn = e.target.closest('.action__btn')

    // handle when click action btn
    if (isMatchBtn) {
        const postId = isMatchBtn.dataset.id

        const post = currentPosts.find((post) => post.id === Number(postId))
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
                    typeConfirm = 'approve'
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
                    typeConfirm = 'reject'
                }

                break
            case 'delete':
                if (confirm(`Bạn có chắc chắn muốn xóa bài đăng này không?`)) {
                    await managerPostServices.deletePost(postId)

                    currentPosts = currentPosts.filter((p) => p.id !== Number(postId))

                    handleLoadPosts(currentPosts)

                    handleLoadOverview()
                }
                break
        }

        if (isConfirm) {
            await managerPostServices.modifyPostStatus(postId, typeConfirm)

            currentPosts = currentPosts.map((p) => {
                if (selectedPost.includes(p.id)) {
                    return {
                        ...p,
                        post_status:
                            typeConfirm === 'approve' ? 'approved' : typeConfirm === 'pending' ? 'pending' : 'rejected',
                    }
                }

                return p
            })

            selectedPost = []

            document.querySelector('#select-all').checked = false

            handleLoadPosts(currentPosts)

            handleLoadOverview()
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

        handleLoadPosts(currentPosts)
    }
}

document.querySelector('#select-all').onchange = (e) => {
    if (e.target.checked) {
        // Nếu chọn tất cả → thêm toàn bộ id bài đăng vào selectedPost
        currentPosts.forEach((post) => {
            selectedPost.push(post.id)
        })
    } else {
        selectedPost = []
    }
    handleLoadPosts(currentPosts)
}
// Hàm handleLoadCategories dùng để render danh sách danh mục vào bộ lọc
async function handleLoadCategories() {
    categoryFilter.innerHTML = categories
        .map((category, index) => {
            return `
                ${index === 0 ? '<option value="all">Tất cả danh mục</option>' : ''}

                <option value="${category.id}">Bất động sản - ${category.name}</option>
            `
        })
        .join('')
}

await handleLoadCategories()

handleLoadPosts(currentPosts)
handleLoadOverview()
