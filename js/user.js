import defaultApp from './default.js'
import getUrlSearchParams from './helpers/getURLSearchParams.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import middleware from './middleware.js'
import * as meServices from './services/meService.js'
import * as postServices from './services/postService.js'

await middleware()

const postManagerTabs = document.querySelectorAll('.post__manager__tabs--button')
const editProfileBtn = document.querySelector('.profile__info--edit')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#overlay')

const { data: currentUser } = await meServices.getCurrentUser()
const { data: user } = await meServices.getUserByNickname(getUrlSearchParams('nickname'))

let { data: posts } = await postServices.getPosts({ params: { user_id: user.id } })

const allowedTabs = ['approved', 'pending', 'rejected', 'not_delivered', 'delivered', 'favorites']

let currentTab = allowedTabs.includes(getUrlSearchParams('active_tab')) ? getUrlSearchParams('active_tab') : 'approved'

//Duyệt qua tất cả tab trong khu vực quản lý bài đăng
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

        window.history.replaceState({}, '', `/user.html?nickname=${user.nickname}&active_tab=${currentTab}`)

        renderUserPost(currentTab)
    }
})

editProfileBtn.onclick = () => {
    modal.setAttribute('src', `modal/editProfile.html`)
    modal.classList.add('active')
    overlay.classList.add('active')
}

//Nếu người đang xem KHÔNG phải chủ trang cá nhân
if (currentUser?.id !== user.id) {
    editProfileBtn.style.display = 'none'

    document.querySelectorAll('.post__manager__tabs--button').forEach((tab) => {
        if (tab.dataset.type === 'approved') {
            return
        }

        tab.style.display = 'none'
    })
}

//Hàm loadUserProfile dùng để hiển thị thông tin hồ sơ người dùng
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
        return `${(Number(amount) / 1000).toFixed(2)} nghìn`
    } else if (amount.length >= 7 && amount.length <= 9) {
        return `${(Number(amount) / 1000000).toFixed(2)} triệu`
    } else {
        return `${(Number(amount) / 1000000000).toFixed(2)} tỷ`
    }
}
//Hàm renderUserPost dùng để render danh sách bài đăng của user theo tab đang chọn
const renderUserPost = async (activeTab = currentTab) => {
    const dataMapping = {
        not_delivered: 'Chưa bàn giao',
        delivered: 'Đã bàn giao',
    }

    switch (activeTab) {
        case 'approved':
        case 'pending':
        case 'rejected':
            posts = posts.filter((post) => {
                return post.post_status === activeTab && post.status === 'Chưa bàn giao'
            })

            break
        case 'not_delivered':
        case 'delivered':
            posts = posts.filter((post) => {
                return post.status === dataMapping[activeTab]
            })
            break
        case 'favorites':
            // const favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []

            // posts = posts.filter((post) => {
            //     return favoritesDb.find(
            //         (favorite) => Number(favorite.post_id) === post.id && favorite.user_id === user.id
            //     )
            // })

            break
        default:
            posts = []
            break
    }

    //Render danh sách bài đăng ra giao diện
    document.querySelector('.post__inner__wrapper').innerHTML = posts
        .map((post) => {
            return `
            <a href="/details.html?post_id=${post.id}" class="col col-6 sm:col-6 md:col-4 lg:col-3 xl:col-2">
                <div class="post__item">
                    <button class="post__item--heart ${post.is_favorite ? 'active' : ''}" data-post-id="${post.id}">
                        <i class="fa-regular fa-heart"></i>
                        <i class="fa-solid fa-heart"></i>
                    </button>

                    <img
                        src=${JSON.parse(post.images)[0]}
                        alt=""
                        onerror="this.src='/public/static/fallback.png'"
                    />
                    <div class="post__item--info">
                        <h4 class="post__item--title">
                            ${post.title}
                        </h4>
                        <p class="post__item--type">${post.json_post_detail.type}</p>

                        <div class="post__item--price">
                            <span class="post__item--price--value">${handleConvertPrice(
                                post.json_post_detail.price
                            )}</span>
                            <span class="post__item--price--unit">${Number(
                                post.json_post_detail.price / post.json_post_detail.area / 1000000
                            ).toFixed(2)} tr/m²</span>
                            <span class="post__item--price--area">${post.json_post_detail.area} m²</span>
                        </div>

                        <span class="post__item--location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${post.administrative_address.split(' - ').reverse()[0]}
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
        //Khi có sự kiện yêu cầu reload lại thông tin user
        case 'user:reload-profile':
            {
                const updatedUser = e.data.data

                window.history.replaceState({}, '', `/user.html?nickname=${updatedUser.nickname}`)
                loadUserProfile(updatedUser)
            }

            break
        default:
            break
    }
})

//Cập nhật số lượng bài đăng cho từng tab quản lý

loadUserProfile(user)
await renderUserPost()

document.querySelector('.post__inner__wrapper').onclick = async (e) => {
    if (e.target.closest('.post__item--heart')) {
        // ngăn chuyển hướng sang trang chi tiết khi click vào heart
        e.preventDefault()

        const heart = e.target.closest('.post__item--heart')

        const postId = heart.dataset.postId

        try {
            const post = posts.find((post) => Number(post.id) === Number(postId))

            if (post.is_favorite) {
                try {
                    await postServices.unlikePost(postId)
                } catch (error) {
                    toast({
                        message: error.message,
                        type: 'error',
                    })
                }
            } else {
                try {
                    await postServices.likePost(postId)
                } catch (error) {
                    toast({
                        message: error.message,
                        type: 'error',
                    })
                }
            }

            posts = posts.map((post) => {
                if (Number(post.id) === Number(postId)) {
                    return {
                        ...post,
                        is_favorite: !post.is_favorite,
                    }
                }
                return post
            })

            renderUserPost()
        } catch (error) {
            console.error(error)

            return
        }
    }
}

defaultApp.init()
