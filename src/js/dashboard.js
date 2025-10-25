const fromDateInput = document.querySelector('input[name="from_date"]')
const toDateInput = document.querySelector('input[name="to_date"]')

const dashboardApp = {
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
        const thirtyDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

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

        const posts = JSON.parse(localStorage.getItem('posts')) || []

        // load overview
        const overview = [
            {
                label: 'Tổng tin đăng',
                value: posts.length,
                color: 'var(--accent)',
                backgroundColor: '#ffaa7d2e',
                icon: 'fa-solid fa-mobile-screen',
                percent: () => {
                    const currentPostsAmount = posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]
                        )
                    })

                    const lookBackPostsAmount = posts.filter((post) => {
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
                value: posts.filter((post) => {
                    return post.is_approved === true
                }).length,
                color: 'var(--success)',
                backgroundColor: '#0bb07924',
                icon: 'fa-solid fa-circle-check',
                percent: () => {
                    const currentPostsAmount = posts.filter((post) => {
                        const postDate = new Date(post.updated_at)

                        return (
                            postDate.toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0] &&
                            post.is_approved === true
                        )
                    })

                    const lookBackPostsAmount = posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >=
                                new Date(lookBackDateStr).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0] &&
                            post.is_approved === true
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
                value: posts.filter((post) => {
                    return post.is_approved === false
                }).length,
                color: '#f59e0b',
                backgroundColor: '#f59f0b28',
                icon: 'fa-solid fa-clock',
            },
            {
                label: 'Người dùng',
                value: JSON.parse(localStorage.getItem('users'))?.length || 0,
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
                <div class="col col-6 lg:col-4 md:col-6 xl:col-3">
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
                                ${item.percent ? item.percent() + '%' : item.value}
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

    handleDonutChart() {
        const groupedPosts = this.groupPostsByCategory(JSON.parse(localStorage.getItem('posts')) || [])

        // Dữ liệu (có thể có n giá trị)
        const data = Object.values(groupedPosts).map((item) => item.value)
        const colors = Object.values(groupedPosts).map((item) => item.color)
        const names = Object.values(groupedPosts).map((item) => item.name)

        // Tính tổng
        const total = data.reduce((a, b) => a + b, 0)

        // Tính chu vi vòng tròn
        const radius = 140
        const circumference = 2 * Math.PI * radius

        // Tạo SVG với group để dễ animate
        let svgContent = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="donut-chart-svg">
            <g class="donut-segments">`

        let offset = 0

        // Vòng lặp tạo từng segment
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

        // Thêm center circle
        svgContent += `<circle cx="200" cy="200" r="60" fill="white"/>`

        // Thêm tooltip
        svgContent += `
            <g class="donut-tooltip" style="opacity: 0; pointer-events: none;">
                <rect x="150" y="180" width="120" height="40" rx="6" fill="rgba(0,0,0,0.85)"/>
                <text x="210" y="195" fill="white" text-anchor="middle" font-size="12" class="tooltip-name"></text>
                <text x="210" y="215" fill="white" text-anchor="middle" font-size="14" font-weight="bold" class="tooltip-percentage"></text>
            </g>
        `

        svgContent += `</svg>`

        // Copy output vào HTML hoặc DOM
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

        // Thêm event listeners cho hover
        this.handleDonutChartHover()
    },

    handleDonutChartHover() {
        const segments = document.querySelectorAll('.donut-segment')
        const tooltip = document.querySelector('.donut-tooltip')
        const tooltipName = document.querySelector('.tooltip-name')
        const tooltipPercentage = document.querySelector('.tooltip-percentage')

        segments.forEach((segment) => {
            segment.addEventListener('mouseenter', (e) => {
                const percentage = e.target.dataset.percentage
                const name = e.target.dataset.name
                const value = e.target.dataset.value

                tooltipName.textContent = this.translatedCategories[name]
                tooltipPercentage.textContent = `${percentage}% (${value})`

                tooltip.style.opacity = '1'

                // Scale up segment
                e.target.style.strokeWidth = '94'
                e.target.style.filter = 'brightness(1.1)'
                e.target.style.cursor = 'pointer'
            })

            segment.addEventListener('mouseleave', (e) => {
                tooltip.style.opacity = '0'

                // Reset segment
                e.target.style.strokeWidth = '90'
                e.target.style.filter = 'none'
            })
        })
    },

    init() {
        this.handleLoadDate()
        this.handleLoadOverview(fromDateInput.value, toDateInput.value)
        this.handleDonutChart()
    },
}

dashboardApp.init()
