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
const commentInput = document.querySelector('textarea[name="comment-input"]')
const commentSubmit = document.querySelector('.comment--input__submit')
const postComments = document.querySelector('.post__comment__wrapper__container')

const postActionsDeleteBtn = document.querySelector('.post__actions__button--delete')
const postActionsEditBtn = document.querySelector('.post__actions__button--edit')
const confirmModalButtonCancel = document.querySelector('.confirm__modal__button--cancel')
const confirmModalButtonConfirm = document.querySelector('.confirm__modal__button--confirm')

const postId = Number(getUrlSearchParams('post_id'))
const currentPost = JSON.parse(localStorage.getItem('posts')).find((post) => post.id === postId)
const postUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === currentPost.user_id)
let comments = JSON.parse(localStorage.getItem('comments'))?.filter((comment) => comment.post_id === postId) || []

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

const handleLoadComments = () => {
    if (comments.length > 0) {
        postComments.classList.add('has-comments')
        handleRenderComment(comments)
    } else {
        postComments.classList.remove('has-comments')
    }
}

const handleReplyComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId)
    const commentUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === comment.user_id)

    commentInput.focus()

    document.querySelector('.reply--input__wrapper').classList.add('active')
    document.querySelector('.reply--input__wrapper').dataset.commentId = commentId
    document.querySelector('.reply--input__wrapper__user').textContent = commentUser.full_name
    document.querySelector('.reply--input__wrapper__content').textContent = comment.content
}

const renderCommentItem = (comment, allComments, level = 0) => {
    const commentUser = JSON.parse(localStorage.getItem('users')).find((user) => user.id === comment.user_id)
    const replies = allComments.filter((cmt) => cmt.parent_id === comment.id)
    const replyCount = replies.length

    const parentComment = allComments.find((cmt) => cmt.id === comment.parent_id)
    const userParentComment = JSON.parse(localStorage.getItem('users')).find(
        (user) => user?.id === parentComment?.user_id
    )

    const commentHTML = `
        <div class="comment--item" style="margin-left: ${level < 3 ? level * 40 : 80}px">
            <div class="comment--item__avatar">
                <img
                    src="${commentUser.avatar}"
                    alt="${commentUser.full_name}"
                    onerror="this.src='/public/static/fallback.png'"
                />
            </div>
            <div class="comment--item__content__wrapper">
                <div class="comment--item__content">
                    <h5>${commentUser.full_name}</h5>
                    <p><span class="comment--item__content--reply--user">${
                        comment.parent_id ? `${userParentComment.full_name} ` : ''
                    }</span>${comment.content}</p>
                </div>
                <div class="comment--item__meta">
                    <span class="comment--item__time">${momentTimezone(comment.created_at).replace('trước', '')}</span>
                    <div class="comment--item__actions">
                        <button class="comment--item__action" data-comment-id="${comment.id}">
                            <i class="fa-regular fa-comment"></i> Trả lời
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `

    let repliesHTML = ''

    if (replyCount > 0) {
        repliesHTML = `
            <div class="replies--wrapper">
                <button class="reply--count active" data-parent-comment-id="${comment.id}" style="margin-left: ${
            level < 3 ? (level + 1) * 40 + 14 : 140
        }px; display: ${comment.is_show_replies ? 'none' : 'block'}">
                    Xem ${replyCount} phản hồi
                </button>
                <div class="replies--container" style="display: ${comment.is_show_replies ? 'block' : 'none'}">
                    ${replies.map((reply) => renderCommentItem(reply, allComments, level + 1)).join('')}
                </div>
            </div>
        `
    }

    return commentHTML + repliesHTML
}

const handleRenderComment = (comments) => {
    const rootComments = comments.filter((comment) => !comment.parent_id)

    const htmls = rootComments.map((comment) => renderCommentItem(comment, comments)).join('')
    document.querySelector('.comment--list').innerHTML = htmls
}

const handleComment = () => {
    const value = commentInput.value

    if (value.trim() === '') {
        return
    }

    const replyCommentId = document.querySelector('.reply--input__wrapper.active')?.dataset.commentId

    const comment = {
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        post_id: postId,
        content: value,
        parent_id: Number(replyCommentId) || null,
        user_id: postUser.id,
        created_at: new Date(),
        updated_at: new Date(),
    }

    comments.push(comment)

    if (replyCommentId) {
        comments = comments.map((cmt) => {
            if (cmt.id === Number(replyCommentId)) {
                return {
                    ...cmt,
                    children: [...(cmt.children || []), comment],
                    is_show_replies: true,
                }
            }

            return cmt
        })
    }

    const handleRemoveIsShowReplies = (comments) => {
        return comments.map((cmt) => {
            // eslint-disable-next-line no-unused-vars
            const { is_show_replies, children, ...cleanComment } = cmt
            return cleanComment
        })
    }

    localStorage.setItem('comments', JSON.stringify(handleRemoveIsShowReplies(comments)))

    commentInput.value = ''

    document.querySelector('.reply--input__wrapper').classList.remove('active')

    handleRenderComment(comments)

    postComments.classList.add('has-comments')
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

document.querySelector('.comment--list').addEventListener('click', (e) => {
    // handle when click reply comment
    if (e.target.closest('.comment--item__action')) {
        const commentId = e.target.dataset.commentId
        handleReplyComment(Number(commentId))
    }

    // handle when click show more replies
    if (e.target.closest('.reply--count')) {
        const button = e.target.closest('.reply--count')

        const repliesContainer = button.nextElementSibling

        if (repliesContainer && repliesContainer.classList.contains('replies--container')) {
            const parentCommentId = button.dataset.parentCommentId

            const isVisible = repliesContainer.style.display !== 'none'

            const handleShowReplies = (cmt, value) => {
                if (cmt.id === parentCommentId) {
                    return {
                        ...cmt,
                        is_show_replies: value,
                    }
                }
            }

            if (isVisible) {
                repliesContainer.style.display = 'none'
                const replyCount = button.textContent.match(/\d+/)[0]
                button.textContent = `Xem ${replyCount} phản hồi`

                handleShowReplies(comments, false)
            } else {
                repliesContainer.style.display = 'block'
                button.style.display = 'none'

                handleShowReplies(comments, true)
            }
        }
    }
})

document.querySelector('.reply--input__wrapper__close').addEventListener('click', () => {
    document.querySelector('.reply--input__wrapper').classList.remove('active')
})

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
    window.location.href = `/post?post_id=${postId}&type=edit`
}

renderImages()
handleLoadCurrentImage(activeImageIndex)
loadPostDetails()
renderDetails()
renderDescription()
handleLoadComments()
renderUserPost()

defaultApp.init()
