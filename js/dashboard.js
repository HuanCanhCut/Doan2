import middleware from './middleware.js'
import toast from './toast.js'

const fromDateInput = document.querySelector('input[name="from_date"]')
const toDateInput = document.querySelector('input[name="to_date"]')
const filterBtn = document.querySelector('.filter--btn')

const addCategoryBtn = document.querySelector('.button--add--category')
const categoryNameInput = document.querySelector('input[name="category_name"]')
const categoryKeyInput = document.querySelector('input[name="category_key"]')
const categoryManagementBodyContent = document.querySelector('.category__management__body--content')

const dashboardApp = {
    posts: JSON.parse(localStorage.getItem('posts')) || [],

    dateFormatter: new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }),

    translatedCategories: {
        apartment: 'Căn hộ/Chung cư',
        house: 'Nhà ở',
        land: 'Đất nền',
        room: 'Phòng trọ',
    },

    handleLoadDate() {
        // default load 30 days ago
        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const todayStr = this.dateFormatter.format(today).split('/').reverse().join('-')
        const thirtyDaysAgoStr = this.dateFormatter.format(thirtyDaysAgo).split('/').reverse().join('-')

        fromDateInput.value = thirtyDaysAgoStr
        toDateInput.value = todayStr
    },

    handleLoadOverview(fromDate, toDate) {
        const dateDiff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)

        // Get date from fromDate - dateDiff
        const lookBackDate = new Date(new Date(fromDate).getTime() - (dateDiff + 1) * 24 * 60 * 60 * 1000)

        // Get date in format (YYYY-MM-DD)
        const lookBackDateStr = lookBackDate.toISOString().split('T')[0]

        // load overview
        const overview = [
            {
                label: 'Tổng tin đăng',
                value: () => {
                    return this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    }).length
                },
                color: 'var(--accent)',
                backgroundColor: '#ffaa7d2e',
                icon: 'fa-solid fa-mobile-screen',
                percent: () => {
                    const currentPostsAmount = this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    })

                    const lookBackPostsAmount = this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >=
                                new Date(lookBackDateStr).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0]
                        )
                    })

                    if (lookBackPostsAmount.length === 0) {
                        return currentPostsAmount.length * 100
                    }

                    const percent =
                        ((currentPostsAmount.length - lookBackPostsAmount.length) / lookBackPostsAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
            },
            {
                label: 'Tin đã duyệt',
                value: () => {
                    return this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            post.post_status === 'approved' &&
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    }).length
                },
                color: 'var(--success)',
                backgroundColor: '#0bb07924',
                icon: 'fa-solid fa-circle-check',
                percent: () => {
                    const currentPostsAmount = this.posts.filter((post) => {
                        const postDate = new Date(post.updated_at)

                        return (
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0] &&
                            post.post_status === 'approved'
                        )
                    })

                    const lookBackPostsAmount = this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >=
                                new Date(lookBackDateStr).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0] &&
                            post.post_status === 'approved'
                        )
                    })

                    if (lookBackPostsAmount.length === 0) {
                        return currentPostsAmount.length * 100
                    }

                    const percent =
                        ((currentPostsAmount.length - lookBackPostsAmount.length) / lookBackPostsAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
            },
            {
                label: 'Chờ duyệt',
                value: () => {
                    return this.posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            post.post_status === 'pending' &&
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    }).length
                },
                color: '#f59e0b',
                backgroundColor: '#f59f0b28',
                icon: 'fa-solid fa-clock',
            },
            {
                label: 'Người dùng',
                value: () => {
                    return (
                        JSON.parse(localStorage.getItem('users'))?.filter((user) => {
                            const userDate = new Date(user.created_at)

                            return (
                                userDate.toISOString().split('T')[0] >=
                                    new Date(fromDate).toISOString().split('T')[0] &&
                                userDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                            )
                        }).length || 0
                    )
                },
                color: '#6a6aff',
                backgroundColor: '#7878ff24',
                icon: 'fa-solid fa-users-rectangle',
                percent: () => {
                    const users = JSON.parse(localStorage.getItem('users')) || []

                    const currentUsersAmount = users.filter((user) => {
                        const userDate = new Date(user.created_at)

                        return (
                            userDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            userDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    })

                    const lookBackUsersAmount = users.filter((user) => {
                        const userDate = new Date(user.created_at)

                        return (
                            userDate.toISOString().split('T')[0] >=
                                new Date(lookBackDateStr).toISOString().split('T')[0] &&
                            userDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0]
                        )
                    })

                    if (lookBackUsersAmount.length === 0) {
                        return currentUsersAmount.length * 100
                    }

                    const percent =
                        ((currentUsersAmount.length - lookBackUsersAmount.length) / lookBackUsersAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
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
                            <p
                                style="
                                    font-size: 1.3rem;
                                    display: flex;
                                    align-items: center;
                                    color: ${
                                        item.percent
                                            ? item.percent() > 0
                                                ? 'var(--success)'
                                                : item.percent() === 0
                                                ? 'gray'
                                                : 'var(--danger)'
                                            : 'gray'
                                    };
                                    gap: 2px;
                                "
                            >
                                ${
                                    item.percent
                                        ? item.percent() > 0
                                            ? '<i class="fa-solid fa-arrow-up"></i>'
                                            : item.percent() === 0
                                            ? '<i class="fa-solid fa-minus"></i>'
                                            : '<i class="fa-solid fa-arrow-down"></i>'
                                        : '<i class="fa-solid fa-minus"></i>'
                                }
                                ${item.percent ? item.percent() + '%' : item.value()}
                            </p>
                        </div>
                    </div>
                </div>
            `
            })
            .join('')
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
        return posts.reduce((acc, curr) => {
            if (!acc[curr.property_category]) {
                acc[curr.property_category] = {
                    name: curr.property_category,
                    value: 0,
                    color: this.getRandomColor(),
                }
            }

            acc[curr.property_category].value++
            return acc
        }, {})
    },

    filterPostsByDate(fromDate, toDate) {
        return this.posts.filter((post) => {
            const postDate = new Date(post.created_at)

            return (
                postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
            )
        })
    },

    handleDonutChart() {
        const groupedPosts = this.groupPostsByCategory(this.filterPostsByDate(fromDateInput.value, toDateInput.value))

        const data = Object.values(groupedPosts).map((item) => item.value)
        const colors = Object.values(groupedPosts).map((item) => item.color)
        const names = Object.values(groupedPosts).map((item) => item.name)

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

        document.querySelector('.chart__item--donut--info').innerHTML = Object.keys(groupedPosts)
            .map((item, index) => {
                return `
                    <div class="chart__item--donut--info--item">
                        <div class="chart__item--donut--info--item--color" style="background-color: ${colors[index]}"></div>
                        <span class="chart__item--donut--info--item--name">${this.translatedCategories[item]}</span>
                    </div>
            `
            })
            .join('')
    },

    handleLoadLocationStats() {
        const fromDate = fromDateInput.value
        const toDate = toDateInput.value

        const groupedPosts = this.filterPostsByDate(fromDate, toDate).reduce((acc, curr) => {
            if (!acc[curr.address_bd]) {
                acc[curr.address_bd] = {
                    name: curr.address_bd,
                    value: 0,
                }
            }

            acc[curr.address_bd].value++
            return acc
        }, {})

        // only show 8 location stats
        let locationStatsSorted = Object.values(groupedPosts).sort((a, b) => b.value - a.value)

        const dateDiff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)

        // Get date from fromDate - dateDiff
        const lookBackDate = new Date(new Date(fromDate).getTime() - (dateDiff + 1) * 24 * 60 * 60 * 1000)

        // Get date in format (YYYY-MM-DD)
        const lookBackDateStr = lookBackDate.toISOString().split('T')[0]

        const groupedPostsLookBack = this.filterPostsByDate(lookBackDateStr, fromDate).reduce((acc, curr) => {
            if (!acc[curr.address_bd]) {
                acc[curr.address_bd] = {
                    name: curr.address_bd,
                    value: 0,
                }
            }

            acc[curr.address_bd].value++
            return acc
        }, {})

        locationStatsSorted = locationStatsSorted.map((item) => {
            const name = item.name

            const percent = Number(((item.value / this.posts.length) * 100).toFixed(2))

            if (groupedPostsLookBack[name]) {
                const growth =
                    ((item.value - groupedPostsLookBack[name].value) / groupedPostsLookBack[name].value) * 100

                return {
                    ...item,
                    growth,
                    percent,
                }
            } else {
                return {
                    ...item,
                    growth: item.value * 100,
                    percent,
                }
            }
        })

        document.querySelector('.location__stats--item--content--wrapper').innerHTML = locationStatsSorted
            .map((item) => {
                return `
                    <div class="row">
                        <div class="col col-3">
                            <div class="location__stats--item--content">
                                ${item.name}
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content">${item.value}</div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content" style="color: ${
                                item.growth > 0 ? 'var(--success)' : item.growth === 0 ? 'gray' : 'var(--danger)'
                            }">
                                ${
                                    item.growth > 0
                                        ? '<i class="fa-solid fa-arrow-up"></i>'
                                        : item.growth === 0
                                        ? '<i class="fa-solid fa-minus"></i>'
                                        : '<i class="fa-solid fa-arrow-down"></i>'
                                } <span>${item.growth}%</span>
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="location__stats--item--content">
                                <span>${item.percent}%</span>
                            </div>
                        </div>
                    </div>
                `
            })
            .join('')
    },

    handleLoadUser() {
        let users = JSON.parse(localStorage.getItem('users')) || []

        users = users.map((user) => {
            return {
                ...user,
                post_amount: this.posts.filter((post) => post.user_id === user.id).length,
            }
        })

        document.querySelector('.user__stats--item--content--wrapper').innerHTML = users
            .map((user) => {
                return `
                <div class="row">
                    <div class="col col-6">
                        <div
                            class="user__stats--item--content user__stats--item--content--user"
                        >
                            <img
                                src="${user.avatar}"
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
                        <div class="user__stats--item--content">${user.post_amount}</div>
                    </div>
                    <div class="col col-3">
                        <div class="user__stats--item--content">
                            <a href="/user?nickname=${user.nickname} ">
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
    },

    handleEvent() {
        filterBtn.onclick = () => {
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
            this.handleDonutChart()
            this.handleLineChart()
            this.handleLoadLocationStats()
            this.handleLoadUser()
        }

        addCategoryBtn.onclick = () => {
            this.handleAddCategory()
        }

        // handle submit when click enter in categoryKeyInput or categoryNameInput
        Array.from([categoryKeyInput, categoryNameInput]).forEach((input) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddCategory()
                }
            })
        })

        categoryManagementBodyContent.onclick = (e) => {
            if (e.target.closest('.action__btn--edit')) {
                const categoriesDb = JSON.parse(localStorage.getItem('categories')) || []
                const categoryId = e.target.closest('.action__btn--edit').dataset.categoryId

                const category = categoriesDb.find((category) => category.id === Number(categoryId))

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

                let categoriesDb = JSON.parse(localStorage.getItem('categories')) || []
                const categoryId = e.target.closest('.action__btn--delete').dataset.categoryId

                const category = categoriesDb.find((category) => category.id === Number(categoryId))

                if (category) {
                    categoriesDb = categoriesDb.filter((category) => category.id !== Number(categoryId))

                    localStorage.setItem('categories', JSON.stringify(categoriesDb))

                    toast({
                        title: 'Thành công',
                        message: 'Danh mục đã được xóa thành công',
                        type: 'success',
                    })

                    this.handleLoadCategoryManagement()

                    return
                }
            }
        }

        document.querySelector('.user__stats--item--content--wrapper').onclick = (e) => {
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

                let usersDb = JSON.parse(localStorage.getItem('users')) || []
                usersDb = usersDb.filter((user) => user.id !== userId)

                localStorage.setItem('users', JSON.stringify(usersDb))

                this.handleLoadUser()

                toast({
                    title: 'Thành công',
                    message: 'Người dùng đã được xóa',
                    type: 'success',
                })
            }
        }
    },

    handleAddCategory() {
        if (categoryNameInput.value === '' || categoryKeyInput.value === '') {
            toast({
                title: 'Thông báo',
                message: 'Vui lòng nhập đầy đủ thông tin',
                type: 'error',
            })
            return
        }

        const categoriesDb = JSON.parse(localStorage.getItem('categories')) || []

        // check if category name or key already exists
        if (
            categoriesDb.some(
                (category) =>
                    category.name === categoryNameInput.value.trim() || category.key === categoryKeyInput.value.trim()
            )
        ) {
            toast({
                title: 'Thông báo',
                message: 'Tên danh mục hoặc key đã tồn tại',
                type: 'error',
            })
            return
        }

        categoriesDb.push({
            id: Math.max(...categoriesDb.map((category) => category.id), 0) + 1,
            name: categoryNameInput.value.trim(),
            key: categoryKeyInput.value.trim(),
        })

        localStorage.setItem('categories', JSON.stringify(categoriesDb))

        toast({
            title: 'Thành công',
            message: 'Danh mục đã được thêm thành công',
            type: 'success',
        })

        categoryNameInput.value = ''
        categoryKeyInput.value = ''

        categoryNameInput.focus()

        this.handleLoadCategoryManagement()
    },

    handleLoadCategoryManagement() {
        const categories = JSON.parse(localStorage.getItem('categories')) || []

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

    init() {
        middleware()
        this.handleLoadDate()
        this.handleLoadOverview(fromDateInput.value, toDateInput.value)
        this.handleDonutChart()
        this.handleLoadCategoryManagement()
        this.handleLoadLocationStats()
        this.handleLoadUser()
        this.handleEvent()
    },
}

dashboardApp.init()
