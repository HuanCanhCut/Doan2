import defaultApp from './default.js'
import { sendEvent } from './helpers/event.js'
import getUrlSearchParams from './helpers/getURLSearchParams.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import toast from './toast.js'

const nextImageBtn = document.querySelector('.details__info__images__preview__btn--next')
const prevImageBtn = document.querySelector('.details__info__images__preview__btn--prev')
const imagesList = document.querySelector('.details__info__images__list')
const imagesPreviewCount = document.querySelector('.details__info__images__preview__count')
const imagesPreviewImg = document.querySelector('.details__info__images__preview .details__info__images__preview__img')
const detailsInfoSave = document.querySelector('.details__info--save')

const detailsTitle = document.querySelector('.details__info--title')
const detailsTypeBedrooms = document.querySelector('.details__info--type--bedrooms')
const detailsTypeType = document.querySelector('.details__info--type--type')
const detailsPrice = document.querySelector('.details__info--price')
const detailsUnitPrice = document.querySelector('.details__info--unit__price')
const detailsAcreageValue = document.querySelector('.details__info--acreage__value')
const detailsLocationValue = document.querySelector('.details__info--location__value')
const detailsLocationUpdated = document.querySelector('.details__info--location__updated')

const postActionsDeleteBtn = document.querySelector('.post__actions__button--delete')
const postActionsEditBtn = document.querySelector('.post__actions__button--edit')
const confirmModalButtonCancel = document.querySelector('.confirm__modal__button--cancel')
const confirmModalButtonConfirm = document.querySelector('.confirm__modal__button--confirm')

const postId = Number(getUrlSearchParams('post_id'))
const currentPost = JSON.parse(localStorage.getItem('posts')).find((post) => post.id === postId)
const postUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === currentPost.user_id)

let activeImageIndex = 0

// render images
function renderImages() {
    imagesList.innerHTML = currentPost.images
        .map((img, index) => {
            return `
             <img
                class="${index === activeImageIndex ? 'active' : ''}"
                data-index="${index}"
                src="${img}"
                alt=""
            />
        `
        })
        .join('')
}

function handleLoadCurrentImage(index) {
    imagesPreviewImg.style.backgroundImage = `url(${currentPost.images[index]})`

    const imageListItem = document.querySelector(`.details__info__images__list img[data-index="${index}"]`)

    imageListItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })

    // load active image

    const imagesListItems = document.querySelectorAll('.details__info__images__list img')
    imagesListItems.forEach((item) => {
        item.classList.remove('active')
    })
    imageListItem.classList.add('active')

    imagesPreviewCount.textContent = `${Number(index) + 1}/${currentPost.images.length}`
}

function loadPostDetails() {
    detailsTitle.textContent = currentPost.title
    detailsTypeBedrooms.textContent = currentPost.detail.bedrooms
    detailsTypeType.textContent = currentPost.detail.type

    if (currentPost.detail.price.length < 7) {
        detailsPrice.textContent = `${Number(currentPost.detail.price) / 1000} nghìn`
    } else if (currentPost.detail.price.length >= 7 && currentPost.detail.price.length <= 9) {
        detailsPrice.textContent = `${Number(currentPost.detail.price) / 1000000} triệu`
    } else {
        detailsPrice.textContent = `${Number(currentPost.detail.price) / 1000000000} tỷ`
    }

    detailsUnitPrice.textContent = Number(currentPost.detail.price / currentPost.detail.area / 1000000).toFixed(2)
    detailsAcreageValue.textContent = currentPost.detail.area

    detailsLocationValue.textContent = currentPost.address
    detailsLocationUpdated.textContent = `${momentTimezone(currentPost.created_at)}`

    // check if the post is in the favorites
    const favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []
    const favoritesExist = favoritesDb.find((favorite) => {
        return (
            favorite.post_id === Number(postId) &&
            favorite.user_id === JSON.parse(localStorage.getItem('currentUser'))?.id
        )
    })

    if (favoritesExist) {
        detailsInfoSave.classList.add('active')
    }
}

imagesList.addEventListener('click', (e) => {
    if (e.target.closest('img')) {
        document.querySelector('.details__info__images__list img.active').classList.remove('active')
        e.target.classList.add('active')

        activeImageIndex = Number(e.target.dataset.index)
        handleLoadCurrentImage(activeImageIndex)
    }
})

nextImageBtn.addEventListener('click', () => {
    activeImageIndex++

    if (activeImageIndex >= currentPost.images.length) {
        activeImageIndex = 0
    }

    handleLoadCurrentImage(activeImageIndex)
})

prevImageBtn.addEventListener('click', () => {
    activeImageIndex--

    if (activeImageIndex < 0) {
        activeImageIndex = currentPost.images.length - 1
    }

    handleLoadCurrentImage(activeImageIndex)
})

detailsInfoSave.addEventListener('click', () => {
    let favoritesDb = JSON.parse(localStorage.getItem('favorites')) || []

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (!currentUser) {
        // open login modal
        sendEvent({
            eventName: 'modal:auth-open',
            detail: 'loginModal',
        })

        return
    }

    detailsInfoSave.classList.toggle('active')

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
})

function renderDetails() {
    const dataMapping = [
        {
            label: 'Tình trạng',
            value: currentPost.status,
            image: 'public/static/property_status.png',
        },
        {
            label: 'Loại hình nhà ở',
            value: currentPost.detail.type,
            image: 'public/static/house_type.png',
        },
        {
            label: 'Diện tích',
            value: currentPost.detail.area,
            image: 'public/static/size.png',
        },
        {
            label: 'Giá/m²',
            value: `${Number(currentPost.detail.price / currentPost.detail.area / 1000000).toFixed(2)} triệu/m²`,
            image: 'public/static/price_m2.png',
        },
        {
            label: 'Hướng cửa chính',
            value: currentPost.detail.main_door,
            image: 'public/static/direction.png',
        },
        {
            label: 'Hướng ban công',
            value: currentPost.detail.balcony,
            image: 'public/static/balcony_direction.png',
        },
        {
            label: 'Giấy tờ pháp lý',
            value: currentPost.detail.legal_documents,
            image: 'public/static/property_legal_document.png',
        },
        {
            label: 'Tình trạng nội thất',
            value: currentPost.detail.interior_status,
            image: 'public/static/interior_status.png',
        },
        {
            label: 'Số phòng ngủ',
            value: currentPost.detail.bedrooms,
            image: 'public/static/rooms.png',
        },
        {
            label: 'Số phòng vệ sinh',
            value: currentPost.detail.bathrooms,
            image: 'public/static/toilets.png',
        },
    ]

    document.querySelector('.details__info--details__list').innerHTML = dataMapping
        .map((data) => {
            if (!data.value) {
                return null
            }

            return `
                <li>
                    <span>
                        <img
                            class="details__info--details--icon"
                            src="${data.image}"
                            alt=""
                        />
                        ${data.label}</span
                    >
                    <span>${data.value}</span>
                </li>
        `
        })
        .join('')
}

function renderDescription() {
    document.querySelector('.details__info__description--content').textContent = currentPost.description
    document.querySelector('.details__info__description--contact--value').textContent = postUser.phone
    const copyBtn = document.querySelector('.details__info__description--contact--copy')

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(postUser.phone)
        copyBtn.textContent = 'Đã sao chép'
        setTimeout(() => {
            copyBtn.textContent = 'Sao chép'
        }, 3000)
    })
}

function renderUserPost() {
    const roleMapping = {
        user: {
            label: 'Cá nhân',
            icon: '<i class="fa-regular fa-circle-user"></i>',
        },
        agent: {
            label: 'Môi giới',
            icon: '<i class="fa-solid fa-briefcase"></i>',
        },
        admin: {
            label: 'Quản trị viên',
            icon: '<i class="fa-solid fa-user-tie"></i>',
        },
    }

    const postLength = JSON.parse(localStorage.getItem('posts')).filter((post) => {
        return post.user_id === currentPost.user_id
    }).length

    document.querySelector('.details__user__info__wrapper').innerHTML = `
        <div class="details__user__info__wrapper__header">
            <img
                src="${postUser.avatar}"
                alt=""
                onerror="this.src='/public/static/fallback.png'"
            />
            <div class="details__user__info__wrapper__content">
                <h3>${postUser.full_name}</h3>
                <p class="details__user__info__wrapper__content--role">
                    ${roleMapping[postUser.role].icon}
                    <span>${roleMapping[postUser.role].label}</span>
                </p>
            </div>
        </div>
        <div class="details__user__info__wrapper__content--actions">
            <span> ${postLength} tin đăng </span>
            <span> ${momentTimezone(postUser.created_at).replace('trước', '')} trên Nhà Tốt </span>
        </div>
        <div class="details__user__info--contact--wrapper">
            <button class="button--outline sign-contract-btn" style="white-space: nowrap;">
                Ký hợp đồng online
            </button> 
            <a 
                href="tel:${postUser.phone}" 
                class="button--primary details__user__info--contact--btn" 
                target="_blank"
                data-phone="${postUser.phone}"
            >
                <span><i class="fa-solid fa-phone-volume"></i></span>
                <span>${postUser.phone || 'Không có số điện thoại'}</span>
            </a>
        </div>
    `
}

// handle when click sign contract button
document.querySelector('.details__user__info__wrapper').onclick = (e) => {
    if (e.target.closest('.sign-contract-btn')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        if (!currentUser) {
            sendEvent({
                eventName: 'modal:auth-open',
                detail: 'loginModal',
            })
        } else {
            if (currentUser.id === postUser.id) {
                toast({
                    title: 'Cảnh báo',
                    message: 'Bạn không thể ký hợp đồng với chính mình.',
                    type: 'warning',
                    duration: 2000,
                })

                return
            }

            window.location.href = `customer_contract.html?buyer_id=${currentUser.id}&agent_id=${postUser.id}&property_id=${postId}`
        }
    }
}

postActionsDeleteBtn.addEventListener('click', () => {
    document.querySelector('.confirm__modal').classList.add('active')
    document.querySelector('#overlay').classList.add('active')
})

confirmModalButtonCancel.addEventListener('click', () => {
    document.querySelector('.confirm__modal').classList.remove('active')
    document.querySelector('#overlay').classList.remove('active')
})

confirmModalButtonConfirm.addEventListener('click', () => {
    localStorage.setItem(
        'posts',
        JSON.stringify(JSON.parse(localStorage.getItem('posts')).filter((post) => post.id !== postId))
    )

    toast({
        title: 'Thành công',
        message: 'Bài viết của bạn đã được xóa.',
        type: 'success',
        duration: 2000,
    })

    setTimeout(() => {
        window.location.href = '/'
    }, 2000)

    document.querySelector('.confirm__modal').classList.remove('active')
    document.querySelector('#overlay').classList.remove('active')
})

postActionsEditBtn.onclick = () => {
    window.location.href = `/post.html?post_id=${postId}&type=edit`
}

function loadPostManagement() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (!currentUser) {
        document.querySelector('.post__actions__wrapper').style.display = 'none'
        return
    }

    if (currentUser.id !== postUser.id) {
        document.querySelector('.post__actions__wrapper').style.display = 'none'
        return
    }
}

renderImages()
handleLoadCurrentImage(activeImageIndex)
loadPostDetails()
renderDetails()
renderDescription()
renderUserPost()
loadPostManagement()

defaultApp.init()
