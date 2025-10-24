const fromDateInput = document.querySelector('input[name="from_date"]')
const toDateInput = document.querySelector('input[name="to_date"]')

// Format theo múi giờ HCM
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
})

const dashboardApp = {
    handleLoadDate() {
        // default load 30 days ago
        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        const todayStr = dateFormatter.format(today).split('/').reverse().join('-')
        const thirtyDaysAgoStr = dateFormatter.format(thirtyDaysAgo).split('/').reverse().join('-')

        fromDateInput.value = thirtyDaysAgoStr
        toDateInput.value = todayStr
    },

    handleLoadOverview(fromDate, toDate) {
        const dateDiff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)

        // Get date from fromDate - dateDiff
        const lookbackDate = new Date(new Date(fromDate).getTime() - (dateDiff + 1) * 24 * 60 * 60 * 1000)

        // Get date in format (YYYY-MM-DD)
        const lookbackDateStr = lookbackDate.toISOString().split('T')[0]

        const posts = JSON.parse(localStorage.getItem('posts')) || []

        // load overview
        const overview = [
            {
                lable: 'Tổng tin đăng',
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

                    const lookbackPostsAmount = posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >=
                                new Date(lookbackDateStr).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0]
                        )
                    })

                    if (lookbackPostsAmount.length === 0) {
                        return currentPostsAmount.length * 100
                    }

                    const percent =
                        ((currentPostsAmount.length - lookbackPostsAmount.length) / lookbackPostsAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
            },
            {
                lable: 'Tin đã duyệt',
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

                    const lookbackPostsAmount = posts.filter((post) => {
                        const postDate = new Date(post.created_at)

                        return (
                            postDate.toISOString().split('T')[0] >=
                                new Date(lookbackDateStr).toISOString().split('T')[0] &&
                            postDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0] &&
                            post.is_approved === true
                        )
                    })

                    if (lookbackPostsAmount.length === 0) {
                        return currentPostsAmount.length * 100
                    }

                    const percent =
                        ((currentPostsAmount.length - lookbackPostsAmount.length) / lookbackPostsAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
            },
            {
                lable: 'Chờ duyệt',
                value: posts.filter((post) => {
                    return post.is_approved === false
                }).length,
                color: '#f59e0b',
                backgroundColor: '#f59f0b28',
                icon: 'fa-solid fa-clock',
            },
            {
                lable: 'Người dùng',
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

                    const lookbackUsersAmount = users.filter((user) => {
                        const userDate = new Date(user.created_at)

                        return (
                            userDate.toISOString().split('T')[0] >=
                                new Date(lookbackDateStr).toISOString().split('T')[0] &&
                            userDate.toISOString().split('T')[0] <= new Date(fromDate).toISOString().split('T')[0]
                        )
                    })

                    if (lookbackUsersAmount.length === 0) {
                        return currentUsersAmount.length * 100
                    }

                    const percent =
                        ((currentUsersAmount.length - lookbackUsersAmount.length) / lookbackUsersAmount.length) * 100

                    return Number(percent.toFixed(2))
                },
            },
        ]

        document.querySelector('.overview--container').innerHTML = overview
            .map((item) => {
                return `
                <div class="col col-6 lg:col-4 md:col-6 xl:col-3">
                    <div class="analytics--item">
                        <div
                            class="analytics--item--icon"
                            style="color: ${item.color}; background-color: ${item.backgroundColor}"
                        >
                            <i class="${item.icon}"></i>
                        </div>
                        <div>
                            <span class="analytics--item--title">${item.lable}</span>
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

    init() {
        this.handleLoadDate()
        this.handleLoadOverview(fromDateInput.value, toDateInput.value)
    },
}

dashboardApp.init()
