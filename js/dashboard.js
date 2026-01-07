import middleware from './middleware.js'
import toast from './toast.js'
import * as analyticsServices from './services/analyticsServices.js'
import * as categoryServices from './services/categoryService.js'
import * as userServices from './services/userService.js'

const fromDateInput = document.querySelector('input[name="from_date"]')
const toDateInput = document.querySelector('input[name="to_date"]')
const filterBtn = document.querySelector('.filter--btn')

const addCategoryBtn = document.querySelector('.button--add--category')
const updateCategoryBtn = document.querySelector('.button--update--category')
const categoryNameInput = document.querySelector('input[name="category_name"]')
const categoryKeyInput = document.querySelector('input[name="category_key"]')
const categoryManagementBodyContent = document.querySelector('.category__management__body--content')

const dashboardApp = {
    dateFormatter: new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }),

    currentCategoryId: null,

    handleLoadDate() {
        // default load 30 days ago
        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const todayStr = this.dateFormatter.format(today).split('/').reverse().join('-')
        const thirtyDaysAgoStr = this.dateFormatter.format(thirtyDaysAgo).split('/').reverse().join('-')

        fromDateInput.value = thirtyDaysAgoStr
        toDateInput.value = todayStr
    },

    async handleLoadOverview(fromDate, toDate) {
        try {
            const { data: overviewData } = await analyticsServices.analyticsOverview(fromDate, toDate)

            // load overview
            const overview = [
                {
                    label: 'Tổng tin đăng',
                    value: overviewData.total_posts,
                    color: 'var(--accent)',
                    backgroundColor: '#ffaa7d2e',
                    icon: 'fa-solid fa-mobile-screen',
                    percent: overviewData.total_posts_growth_percent,
                },
                {
                    label: 'Tin đã duyệt',
                    value: overviewData.approved_posts,
                    color: 'var(--success)',
                    backgroundColor: '#0bb07924',
                    icon: 'fa-solid fa-circle-check',
                    percent: overviewData.approved_posts_growth_percent,
                },
                {
                    label: 'Chờ duyệt',
                    value: overviewData.pending_posts,
                    color: '#f59e0b',
                    backgroundColor: '#f59f0b28',
                    icon: 'fa-solid fa-clock',
                },
                {
                    label: 'Người dùng',
                    value: overviewData.users,
                    color: '#6a6aff',
                    backgroundColor: '#7878ff24',
                    icon: 'fa-solid fa-users-rectangle',
                    percent: overviewData.users_growth_percent,
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
                            <h1 style="font-size: 2.8rem; font-weight: 700; margin: 12px auto">${item.value}</h1>
                            <p
                                style="
                                    font-size: 1.3rem;
                                    display: flex;
                                    align-items: center;
                                    color: ${
                                        item.percent
                                            ? item.percent > 0
                                                ? 'var(--success)'
                                                : item.percent === 0
                                                ? 'gray'
                                                : 'var(--danger)'
                                            : 'gray'
                                    };
                                    gap: 2px;
                                "
                            >
                                ${
                                    item.percent
                                        ? item.percent > 0
                                            ? '<i class="fa-solid fa-arrow-up"></i>'
                                            : item.percent === 0
                                            ? '<i class="fa-solid fa-minus"></i>'
                                            : '<i class="fa-solid fa-arrow-down"></i>'
                                        : '<i class="fa-solid fa-minus"></i>'
                                }
                                ${item.percent ? item.percent + '%' : item.value}
                            </p>
                        </div>
                    </div>
                </div>
            `
                })
                .join('')
        } catch (error) {
            toast({
                title: 'Lỗi',
                message: error.message,
                type: 'error',
            })
        }
    },

    getRandomColor() {
        let letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    },

    groupPostsByCategory(posts) {
        const categories = JSON.parse(localStorage.getItem('categories')) || []

        return posts.reduce((acc, curr) => {
            if (!acc[curr.property_category]) {
                acc[curr.property_category] = {
                    name:
                        categories.find((category) => category.key === curr.property_category)?.name ||
                        curr.property_category,
                    value: 0,
                    color: this.getRandomColor(),
                }
            }

            acc[curr.property_category].value++
            return acc
        }, {})
    },

    async handleDonutChart() {
        const { data: categories } = await categoryServices.getCategories()

        const data = categories.map((item) => item.percentage)
        const colors = categories.map((item) => this.getRandomColor())
        const names = categories.map((item) => item.name)

        const total = data.reduce((a, b) => a + b, 0)

        // Chu vi vòng tròn
        const radius = 140
        const circumference = 2 * Math.PI * radius

        let svgContent = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="donut-chart-svg">
            <g class="donut-segments">`

        let offset = 0

        // Tạo segment
        data.forEach((value, index) => {
            const percentage = (value / total) * 100
            const dashLength = (percentage / 100) * circumference
            const color = colors[index % colors.length]
            const name = names[index % names.length]

            svgContent += `
                <circle cx="200" cy="200" r="${radius}" fill="none" stroke="${color}" stroke-width="90" 
                stroke-dasharray="${dashLength} ${circumference}" stroke-dashoffset="-${offset}" stroke-linecap="butt"
                class="donut-segment" data-percentage="${percentage.toFixed(
                    1
                )}" data-name="${name}" data-value="${value}"/>
            `

            offset += dashLength
        })

        svgContent += `</g>`

        svgContent += `<circle cx="200" cy="200" r="60" fill="white"/>`

        svgContent += `</svg>`

        document.querySelector('.chart__item--donut').innerHTML = svgContent

        document.querySelector('.chart__item--donut--info').innerHTML = categories
            .map((item, index) => {
                return `
                    <div class="chart__item--donut--info--item">
                        <div class="chart__item--donut--info--item--color" style="background-color: ${colors[index]}"></div>
                        <span class="chart__item--donut--info--item--name">${item.name}</span>
                    </div>
            `
            })
            .join('')
    },

    async handleLoadLocationStats() {
        try {
            const fromDate = fromDateInput.value
            const toDate = toDateInput.value

            const { data: locationStatsSorted } = await analyticsServices.getLocationStatsSorted(fromDate, toDate)

            document.querySelector('.location__stats--item--content--wrapper').innerHTML = locationStatsSorted
                .map((item) => {
                    return `
                    <div class="row">
                        <div class="col col-3">
                            <div class="location__stats--item--content">
                                ${item.address}
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content">${item.post_count}</div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content" style="color: ${
                                item.growth_rate > 0
                                    ? 'var(--success)'
                                    : item.growth_rate === 0
                                    ? 'gray'
                                    : 'var(--danger)'
                            }">
                                ${
                                    item.growth_rate > 0
                                        ? '<i class="fa-solid fa-arrow-up"></i>'
                                        : item.growth_rate === 0
                                        ? '<i class="fa-solid fa-minus"></i>'
                                        : '<i class="fa-solid fa-arrow-down"></i>'
                                } <span>${item.growth_rate}%</span>
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content">
                                <span>${item.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                `
                })
                .join('')
        } catch (error) {
            toast({
                title: 'Lỗi',
                message: error.message,
                type: 'error',
            })
        }
    },

    async handleLoadUser() {
        try {
            const { data: users } = await userServices.getAllUsers(1, 10)

            document.querySelector('.user__stats--item--content--wrapper').innerHTML = users
                .map((user) => {
                    return `
                <div class="row">
                    <div class="col col-6">
                        <div
                            class="user__stats--item--content user__stats--item--content--user"
                        >
                            <img
                                src="${user.avatar_url || ''}"
                                alt=""
                                onerror="this.src='/public/static/fallback.png'"
                            />
                            <div class="user__stats--item--content--info">
                                <p>
                                    ${user.full_name}
                                </p>
                                <p class="user__stats--item--content--info--email">
                                    ${user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col col-3">
                        <div class="user__stats--item--content">${user.post_count}</div>
                    </div>
                    <div class="col col-3">
                        <div class="user__stats--item--content">
                            <a href="/user.html?nickname=${user.nickname} ">
                                <i class="fa-regular fa-eye"></i>
                            </a>
                            <button title="Xóa" class="user__stats--item--content--delete" data-user-id="${user.id}">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
                })
                .join('')
        } catch (error) {
            toast({
                title: 'Lỗi',
                message: error.message,
                type: 'error',
            })
        }
    },

    handleEvent() {
        filterBtn.onclick = async () => {
            if (fromDateInput.value === '') {
                // 1970-01-01
                fromDateInput.value = new Date(1970, 0, 1).toISOString().split('T')[0]
            }
            if (toDateInput.value === '') {
                // today
                toDateInput.value = new Date().toISOString().split('T')[0]
            }

            if (new Date(fromDateInput.value) > new Date(toDateInput.value)) {
                toast({
                    title: 'Thông báo',
                    message: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                    type: 'error',
                })
                return
            }

            this.handleLoadOverview(fromDateInput.value, toDateInput.value)
            await this.handleDonutChart()
            this.handleLoadLocationStats()
            this.handleLoadUser()
        }

        addCategoryBtn.onclick = async () => {
            await this.handleModifyCategory('add')
        }

        updateCategoryBtn.onclick = async () => {
            await this.handleModifyCategory('update')
        }

        // handle submit when click enter in categoryKeyInput or categoryNameInput
        Array.from([categoryKeyInput, categoryNameInput]).forEach((input) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleModifyCategory()
                }
            })
        })

        categoryManagementBodyContent.onclick = async (e) => {
            const { data: categories } = await categoryServices.getCategories()

            if (e.target.closest('.action__btn--edit')) {
                this.currentCategoryId = Number(e.target.closest('.action__btn--edit').dataset.categoryId)

                const categoryId = e.target.closest('.action__btn--edit').dataset.categoryId

                const category = categories.find((category) => category.id === Number(categoryId))

                if (category) {
                    categoryNameInput.value = category.name
                    categoryKeyInput.value = category.key
                }

                categoryNameInput.focus()

                return
            }

            if (e.target.closest('.action__btn--delete')) {
                if (!confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
                    return
                }

                const categoryId = e.target.closest('.action__btn--delete').dataset.categoryId

                const category = categories.find((category) => category.id === Number(categoryId))

                if (category) {
                    await categoryServices.deleteCategory(Number(categoryId))

                    toast({
                        title: 'Thành công',
                        message: 'Danh mục đã được xóa thành công',
                        type: 'success',
                    })

                    await this.handleLoadCategoryManagement()

                    return
                }
            }
        }

        document.querySelector('.user__stats--item--content--wrapper').onclick = async (e) => {
            if (e.target.closest('.user__stats--item--content--delete')) {
                const userId = Number(e.target.closest('.user__stats--item--content--delete').dataset.userId)

                if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
                    return
                }

                const currentUser = JSON.parse(localStorage.getItem('currentUser'))

                if (userId === currentUser?.id) {
                    toast({
                        title: 'Thông báo',
                        message: 'Bạn không thể xóa chính mình',
                        type: 'error',
                    })
                }

                await userServices.deleteUser(userId)

                this.handleLoadUser()

                toast({
                    title: 'Thành công',
                    message: 'Người dùng đã được xóa',
                    type: 'success',
                })
            }
        }
    },

    async handleModifyCategory(type = 'add') {
        if (categoryNameInput.value === '' || categoryKeyInput.value === '') {
            toast({
                title: 'Thông báo',
                message: 'Vui lòng nhập đầy đủ thông tin',
                type: 'error',
            })
            return
        }

        switch (type) {
            case 'add':
                try {
                    await categoryServices.addCategory({
                        name: categoryNameInput.value.trim(),
                        key: categoryKeyInput.value.trim(),
                    })

                    toast({
                        title: 'Thành công',
                        message: 'Danh mục đã được thêm thành công',
                        type: 'success',
                    })
                } catch (error) {
                    toast({
                        title: 'Thông báo',
                        message: error.message,
                        type: 'error',
                    })
                }
                break
            case 'update':
                try {
                    await categoryServices.updateCategory({
                        id: Number(this.currentCategoryId),
                        name: categoryNameInput.value.trim(),
                        key: categoryKeyInput.value.trim(),
                    })

                    toast({
                        title: 'Thành công',
                        message: 'Danh mục đã được cập nhật thành công',
                        type: 'success',
                    })
                } catch (error) {
                    toast({
                        title: 'Thông báo',
                        message: error.message,
                        type: 'error',
                    })
                }
                break
            default:
                break
        }

        categoryNameInput.value = ''
        categoryKeyInput.value = ''

        categoryNameInput.focus()

        await this.handleLoadCategoryManagement()
    },

    async handleLoadCategoryManagement() {
        this.currentCategoryId = null

        const { data: categories } = await categoryServices.getCategories()

        categoryManagementBodyContent.innerHTML = categories
            .map((category) => {
                return `
                <div class="row">
                    <div class="col-4">${category.name}</div>
                    <div class="col-4">${category.key}</div>
                    <div class="col-4">
                        <div style="display: flex; justify-content: center; gap: 16px">
                            <button data-category-id="${category.id}" class="action__btn action__btn--edit" title="Cập nhật"><i class="fa-solid fa-pencil"></i></button>
                            <button data-category-id="${category.id}" class="action__btn action__btn--delete" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `
            })
            .join('')
    },

    async init() {
        await middleware()
        this.handleLoadDate()
        await this.handleLoadOverview(fromDateInput.value, toDateInput.value)
        await this.handleDonutChart()
        await this.handleLoadCategoryManagement()
        await this.handleLoadLocationStats()
        await this.handleLoadUser()
        this.handleEvent()
    },
}

dashboardApp.init()
