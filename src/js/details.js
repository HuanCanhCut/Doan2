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

const postId = Number(getUrlSearchParams('post_id'))

const currentPost = JSON.parse(localStorage.getItem('posts')).find((post) => post.id === postId)
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

    imageListItem.scrollIntoView({ behavior: 'smooth', inline: 'center' })

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

renderImages()
handleLoadCurrentImage(activeImageIndex)
loadPostDetails()

defaultApp.init()
