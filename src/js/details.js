import defaultApp from './default'
import getUrlSearchParams from './helpers/getURLSearchParams'
import { momentTimezone } from './helpers/momentTimezone'

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
const commentInput = document.querySelector('textarea[name="comment-input"]')
const commentSubmit = document.querySelector('.comment--input__submit')
const postComments = document.querySelector('.post__comment__wrapper__container')

const postId = Number(getUrlSearchParams('post_id'))
const currentPost = JSON.parse(localStorage.getItem('posts')).find((post) => post.id === postId)
const postUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === currentPost.user_id)
const comments = JSON.parse(localStorage.getItem('comments')) || []

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
    detailsInfoSave.classList.toggle('active')

    let postDb = JSON.parse(localStorage.getItem('favorites')) || []

    const postExist = postDb.find((post) => post === postId)

    if (postExist) {
        postDb = postDb.filter((post) => post !== postId)
    } else {
        postDb.push(postId)
    }

    localStorage.setItem('favorites', JSON.stringify(postDb))
})

function renderDetails() {
    const dataMapping = [
        {
            label: 'Tình trạng',
            value: currentPost.status,
            image: '/static/property_status.png',
        },
        {
            label: 'Loại hình nhà ở',
            value: currentPost.detail.type,
            image: '/static/house_type.png',
        },
        {
            label: 'Diện tích',
            value: currentPost.detail.area,
            image: '/static/size.png',
        },
        {
            label: 'Giá/m²',
            value: `${Number(currentPost.detail.price / currentPost.detail.area / 1000000).toFixed(2)} triệu/m²`,
            image: '/static/price_m2.png',
        },
        {
            label: 'Hướng cửa chính',
            value: currentPost.detail.main_door,
            image: '/static/direction.png',
        },
        {
            label: 'Hướng ban công',
            value: currentPost.detail.balcony,
            image: '/static/balcony_direction.png',
        },
        {
            label: 'Giấy tờ pháp lý',
            value: currentPost.detail.legal_documents,
            image: '/static/property_legal_document.png',
        },
        {
            label: 'Tình trạng nội thất',
            value: currentPost.detail.interior_status,
            image: '/static/interior_status.png',
        },
        {
            label: 'Số phòng ngủ',
            value: currentPost.detail.bedrooms,
            image: '/static/rooms.png',
        },
        {
            label: 'Số phòng vệ sinh',
            value: currentPost.detail.bathrooms,
            image: '/static/toilets.png',
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
                onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PyKYrBKAWWy6YCbQzWQcwIRqH8wYMPluIZiMpV1w0NYSbocTZz0ICWFkLcXhaMyvCwQ&usqp=CAU'"
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
        <a 
            href="tel:${postUser.phone}" 
            class="button--primary details__user__info--contact--btn" 
            target="_blank"
            data-phone="${postUser.phone}"
        >
            <span><i class="fa-solid fa-phone-volume"></i></span>
            <span>${postUser.phone || 'Không có số điện thoại'}</span>
        </a>
    `
}

const handleLoadComments = () => {
    if (comments.length > 0) {
        postComments.classList.add('has-comments')
        handleRenderComment()
    } else {
        postComments.classList.remove('has-comments')
    }
}

const handleRenderComment = () => {
    document.querySelector('.comment--list').innerHTML = comments
        .map((comment) => {
            // if comment is a reply, skip
            if (comment.parent_id) {
                return null
            }

            const commentUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === comment.user_id)
            const replyCount = JSON.parse(localStorage.getItem('comments')).filter(
                (comment) => comment.parent_id === comment.id
            ).length

            return `
                <div class="comment--item">
                    <div class="comment--item__avatar">
                        <img
                            src="${commentUser.avatar}"
                            alt="${commentUser.full_name}"
                            onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PyKYrBKAWWy6YCbQzWQcwIRqH8wYMPluIZiMpV1w0NYSbocTZz0ICWFkLcXhaMyvCwQ&usqp=CAU'"
                        />
                    </div>
                    <div class="comment--item__content__wrapper">
                        <div class="comment--item__content">
                            <h5>${commentUser.full_name}</h5>
                            <p>${comment.content}</p>
                        </div>
                        <div class="comment--item__meta">
                            <span class="comment--item__time">${momentTimezone(comment.created_at).replace(
                                'trước',
                                ''
                            )}</span>
                            <div class="comment--item__actions">
                                <button class="comment--item__action">
                                    <i class="fa-regular fa-comment"></i> Trả lời
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="reply--count ${replyCount > 0 ? 'active' : ''}">Xem ${replyCount} phản hồi</button>
        `
        })
        .join('')
}

const handleComment = () => {
    const value = commentInput.value

    if (value.trim() === '') {
        return
    }

    const comment = {
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        post_id: postId,
        content: value,
        parent_id: null,
        user_id: postUser.id,
        created_at: new Date(),
        updated_at: new Date(),
    }

    comments.push(comment)
    localStorage.setItem('comments', JSON.stringify(comments))
    handleRenderComment()
}

commentInput.oninput = (e) => {
    if (e.target.value.split('\n').length === 1) {
        commentInput.style.overflow = 'hidden'
    } else {
        commentInput.style.overflow = 'auto'
    }

    commentInput.style.height = 'auto'
    commentInput.style.height = commentInput.scrollHeight + 'px'
}

commentInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()

        handleComment()
    }
}

commentSubmit.addEventListener('click', () => {
    handleComment()
})

renderImages()
handleLoadCurrentImage(activeImageIndex)
loadPostDetails()
renderDetails()
renderDescription()
handleLoadComments()
renderUserPost()

defaultApp.init()
