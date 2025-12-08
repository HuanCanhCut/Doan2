import defaultApp from './default.js'
import getUrlSearchParams from './helpers/getURLSearchParams.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import middleware from './middleware.js'
middleware()

const postManagerTabs = document.querySelectorAll('.post__manager__tabs--button')
const editProfileBtn = document.querySelector('.profile__info--edit')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#overlay')

const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const user = JSON.parse(localStorage.getItem('users')).find((user) => user.nickname === getUrlSearchParams('nickname'))

const allowedTabs = ['approved', 'pending', 'rejected', 'not_delivered', 'delivered', 'favorites']

let currentTab = allowedTabs.includes(getUrlSearchParams('active_tab')) ? getUrlSearchParams('active_tab') : 'approved'

postManagerTabs.forEach((tab) => {
    if (tab.dataset.type === currentTab) {
        tab.classList.add('active')
    }

    tab.onclick = () => {
        postManagerTabs.forEach((tab) => {
            tab.classList.remove('active')
        })

        tab.classList.add('active')

        tab.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        })

        currentTab = tab.dataset.type

        window.history.replaceState({}, '', `/user?nickname=${user.nickname}&active_tab=${currentTab}`)

        renderUserPost(currentTab)
    }
})

editProfileBtn.onclick = () => {
    modal.setAttribute('src', `modal/editProfile.html`)
    modal.classList.add('active')
    overlay.classList.add('active')
}

// load ui based on current user
if (currentUser.id !== user.id) {
    editProfileBtn.style.display = 'none'

    document.querySelectorAll('.post__manager__tabs--button').forEach((tab) => {
        if (tab.dataset.type === 'approved') {
            return
        }

        tab.style.display = 'none'
    })
}

const loadUserProfile = (user) => {
    document.querySelector('.profile__detail--value--email').textContent = user.email
    document.querySelector('.profile__detail--value--phone').textContent = user.phone
    document.querySelector('.profile__detail--value--joined').textContent = momentTimezone(user.created_at).replace(
        'trước',
        ''
    )

    document.querySelector('.profile img').src = user.avatar
    document.querySelector('.profile__info--name').textContent = user.full_name
    document.querySelector('.profile__info--nickname').textContent = user.nickname
}

const handleConvertPrice = (amount) => {
    if (amount.length < 7) {
        return `${Number(amount) / 1000} nghìn`
    } else if (amount.length >= 7 && amount.length <= 9) {
        return `${Number(amount) / 1000000} triệu`
    } else {
        return `${Number(amount) / 1000000000} tỷ`
    }
}

const renderUserPost = (activeTab = currentTab) => {
    const dataMapping = {
        not_delivered: 'Chưa bàn giao',
        delivered: 'Đã bàn giao',
    }

    let posts = JSON.parse(localStorage.getItem('posts'))

    switch (activeTab) {
        case 'approved':
        case 'pending':
        case 'rejected':
            posts = posts.filter((post) => {
                return post.user_id === user.id && post.post_status === activeTab && post.status === 'Chưa bàn giao'
            })

            break
        case 'not_delivered':
        case 'delivered':
            posts = posts.filter((post) => {
                return post.user_id === user.id && post.status === dataMapping[activeTab]
            })
            break
        case 'favorites':
            const favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []

            posts = posts.filter((post) => {
                return favoritesDb.find((favorite) => favorite.post_id === post.id && favorite.user_id === user.id)
            })
            break
        default:
            posts = []
            break
    }

    document.querySelector('.post__inner__wrapper').innerHTML = posts
        .map((post) => {
            const favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []
            const isFavorite = favoritesDb.find(
                (favorite) => favorite.post_id === post.id && favorite.user_id === user.id
            )

            return `
            <a href="/details.html?post_id=${post.id}" class="col col-6 sm:col-6 md:col-4 lg:col-3 xl:col-2">
                <div class="post__item">
                    <button class="post__item--heart ${isFavorite ? 'active' : ''}" data-post-id="${post.id}">
                        <i class="fa-regular fa-heart"></i>
                        <i class="fa-solid fa-heart"></i>
                    </button>

                    <img
                        src=${post.images[0]}
                        alt=""
                        onerror="this.src='/public/static/fallback.png'"
                    />
                    <div class="post__item--info">
                        <h4 class="post__item--title">
                            ${post.title}
                        </h4>
                        <p class="post__item--type">${post.detail.type}</p>

                        <div class="post__item--price">
                            <span class="post__item--price--value">${handleConvertPrice(post.detail.price)}</span>
                            <span class="post__item--price--unit">${Number(
                                post.detail.price / post.detail.area / 1000000
                            ).toFixed(2)} tr/m²</span>
                            <span class="post__item--price--area">${post.detail.area} m²</span>
                        </div>

                        <span class="post__item--location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${post.address_bd.split(' - ').reverse()[0]}
                        </span>
                    </div>
                </div>
            </a>
        `
        })
        .join('')
}

window.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'user:reload-profile':
            {
                const updatedUser = e.data.data

                window.history.replaceState({}, '', `/user?nickname=${updatedUser.nickname}`)
                loadUserProfile(updatedUser)
            }

            break
        default:
            break
    }
})

document.querySelectorAll('.post__manager__tabs--button--count').forEach((tab) => {
    const dataMapping = {
        not_delivered: 'Chưa bàn giao',
        delivered: 'Đã bàn giao',
    }

    switch (tab.dataset.type) {
        case 'approved':
        case 'pending':
        case 'rejected':
            {
                const posts = (JSON.parse(localStorage.getItem('posts')) || []).filter((post) => {
                    return (
                        post.user_id === user.id &&
                        post.post_status === tab.dataset.type &&
                        post.status === 'Chưa bàn giao'
                    )
                })

                tab.textContent = `(${posts.length})`
            }
            break
        case 'not_delivered':
        case 'delivered':
            {
                const posts = (JSON.parse(localStorage.getItem('posts')) || []).filter((post) => {
                    return post.user_id === user.id && post.status === dataMapping[tab.dataset.type]
                })

                tab.textContent = `(${posts.length})`
            }
            break
        case 'favorites':
            {
                const favorites = JSON.parse(localStorage.getItem('favorites')) || []

                tab.textContent = `(${favorites.length})`
            }
            break
        default:
            break
    }
})

loadUserProfile(user)
renderUserPost()

document.querySelector('.post__inner__wrapper').onclick = (e) => {
    if (e.target.closest('.post__item--heart')) {
        // ngăn chuyển hướng khi click vào heart
        e.preventDefault()

        const heart = e.target.closest('.post__item--heart')

        heart.classList.toggle('active')

        let favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []

        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        const favoritesExist = favoritesDb.find((favorite) => {
            return favorite.post_id === Number(postId) && favorite.user_id === currentUser?.id
        })

        if (favoritesExist) {
            favoritesDb = favoritesDb.filter(
                (favorite) => favorite.post_id !== postId && favorite.user_id !== currentUser?.id
            )
        } else {
            favoritesDb = [...favoritesDb, { post_id: postId, user_id: currentUser.id }]
        }

        localStorage.setItem('favorites', JSON.stringify(favoritesDb))
    }
}

defaultApp.init()
