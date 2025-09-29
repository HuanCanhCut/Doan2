import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency'
import './popperWrapper'
import { handleSetPosition } from './popperWrapper'
import mockPosts from '../mocks/posts'
import { momentTimezone } from './helpers/momentTimezone'

const filterItemsButton = document.querySelectorAll('.filter__item--button')
const applyPriceFilterButton = document.querySelector('.price_min_max_apply')
const resetPriceFilterButton = document.querySelector('.price_min_max_reset')
const priceMinInput = document.querySelector('.price_min')
const priceMaxInput = document.querySelector('.price_max')
const filterItemDropdownButtons = document.querySelectorAll('.filter__item__dropdown--button')
const filterItemCategoryButtons = document.querySelectorAll('.filter__item--category')
const removeCategoryBtn = document.querySelector('.remove__category--btn')
const postInner = document.querySelector('.post__inner')

// tabs
const postTabs = document.querySelectorAll('.post__tabs button')
const postTabsLine = document.querySelector('.post__tabs--line')

const app = {
    posts: JSON.parse(localStorage.getItem('posts')) || mockPosts || [],
    filters: {
        categories: 'sell' /* sell or rent */,
        type: [], // apartment, house, land, room
        price: {
            start: 0,
            end: Infinity,
            active: false,
        },
    },
    filterActive: null,
    postType: 'all', // all, agent, personal

    handleFilterPost() {
        const filteredPosts = this.posts.filter((post) => {
            const matchCategory = this.filters.categories === '' || post.project_type === this.filters.categories
            if (!matchCategory) return false

            const matchType = this.filters.type.length === 0 || this.filters.type.includes(post.property_category)
            if (!matchType) return false

            const matchPostType = this.postType === 'all' || post.role === this.postType
            if (!matchPostType) return false

            if (this.filters.price.active) {
                const matchPrice =
                    post.detail.price >= this.filters.price.start && post.detail.price <= this.filters.price.end
                if (!matchPrice) return false
            }

            return true
        })

        console.log(filteredPosts)

        return filteredPosts
    },

    handleLoadFilterActive() {
        filterItemsButton.forEach((btn) => {
            const parentElement = getParentElement(btn, '.filter__item')

            if (!this.filters[parentElement.dataset.type] || !this.filters[parentElement.dataset.type]?.active) {
                parentElement.classList.remove('active')
            }

            parentElement.querySelector('.filter__item__dropdown').classList.remove('active')

            if (parentElement.dataset.type === this.filterActive) {
                parentElement.classList.add('active')

                parentElement.querySelector('.filter__item__dropdown').classList.add('active')
            }
        })

        filterItemsButton.forEach((btn) => {
            if (typeof this.filters[btn.parentElement.dataset.type] === 'object') {
                if (this.filters[btn.parentElement.dataset.type]?.active) {
                    getParentElement(btn, '.filter__item').classList.add('active')
                }
            } else {
                if (this.filters[btn.parentElement.dataset.type]) {
                    getParentElement(btn, '.filter__item').classList.add('active')
                }
            }
        })
    },

    handleCloseDropdownFilter() {
        filterItemsButton.forEach((btn) => {
            const parentElement = btn.parentElement

            parentElement.classList.remove('active')

            parentElement.querySelector('.filter__item__dropdown').classList.remove('active')

            this.filterActive = null
        })

        this.handleLoadFilterActive()
    },

    handleEvent() {
        // handle click filter item
        filterItemsButton.forEach((btn) => {
            btn.onclick = () => {
                const parentElement = getParentElement(btn, '.filter__item')

                if (this.filterActive === parentElement.dataset.type) {
                    this.filterActive = null
                } else {
                    this.filterActive = parentElement.dataset.type
                }

                this.handleLoadFilterActive()

                handleSetPosition(parentElement.querySelector('.filter__item__dropdown'))
            }
        })

        // Filter by price
        applyPriceFilterButton.onclick = () => {
            const priceMin = Number(priceMinInput.value.split('.').join(''))
            const priceMax = Number(priceMaxInput.value.split('.').join(''))

            if (priceMin > priceMax) {
                document.querySelector('.filter__item__dropdown__price--error').innerText =
                    'Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa'
            }

            if (priceMin === '' || priceMax === '') {
                document.querySelector('.filter__item__dropdown__price--error').innerText =
                    'Giá tối thiểu và giá tối đa không được để trống'
            }

            this.filters.price.start = priceMin
            this.filters.price.end = priceMax
            this.filters.price.active = true

            this.handleCloseDropdownFilter()

            this.handleRenderPost(this.handleFilterPost())
        }

        // Reset filter by price
        resetPriceFilterButton.onclick = () => {
            this.filters.price.active = false

            this.handleCloseDropdownFilter()

            this.handleRenderPost(this.posts)
        }

        Array.from([priceMinInput, priceMaxInput]).forEach((input) => {
            input.oninput = (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                e.target.value = convertConcurrencyToNumber(Number(e.target.value.split('.').join('')))
            }
        })

        // Filter by type
        filterItemDropdownButtons.forEach((btn) => {
            btn.onclick = () => {
                filterItemDropdownButtons.forEach((btn) => {
                    if (btn.dataset.parent === this.filterActive) {
                        btn.querySelector('.checkbox').classList.remove('checked')
                    }
                })

                btn.querySelector('.checkbox').classList.add('checked')

                getParentElement(btn, '.filter__item').querySelector('.filter__item--button span').textContent =
                    btn.innerText

                this.filters[btn.dataset.parent] = btn.dataset.value

                this.handleRenderPost(this.handleFilterPost())
            }
        })

        // Reset filter by category
        removeCategoryBtn.onclick = () => {
            this.filters.categories = ''

            getParentElement(removeCategoryBtn, '.filter__item')
                .querySelectorAll('.checkbox')
                .forEach((checkbox) => {
                    checkbox.classList.remove('checked')
                })

            this.handleCloseDropdownFilter()

            this.handleRenderPost(this.posts)
        }

        // Filter by category
        filterItemCategoryButtons.forEach((btn) => {
            btn.onclick = () => {
                if (this.filters.type.includes(btn.dataset.type)) {
                    this.filters.type = this.filters.type.filter((type) => type !== btn.dataset.type)
                } else {
                    this.filters.type.push(btn.dataset.type)
                }

                filterItemCategoryButtons.forEach((btn) => {
                    if (btn.classList.contains('active')) {
                        return
                    }

                    btn.classList.remove('active')
                })

                btn.classList.toggle('active')

                this.handleRenderPost(this.handleFilterPost())
            }
        })

        postTabs.forEach((btn) => {
            btn.onclick = (e) => {
                postTabsLine.style.left = `${e.target.offsetLeft}px`
                postTabsLine.style.width = `${e.target.offsetWidth}px`

                postTabs.forEach((btn) => {
                    btn.classList.remove('active')
                })

                btn.classList.add('active')
                this.postType = btn.dataset.type

                this.handleRenderPost(this.handleFilterPost())
            }

            btn.onmouseover = (e) => {
                postTabsLine.style.width = `${e.target.offsetWidth}px`
                postTabsLine.style.left = `${e.target.offsetLeft}px`
            }

            btn.onmouseleave = () => {
                postTabsLine.style.width = `${document.querySelector('.post__tabs button.active').offsetWidth}px`
                postTabsLine.style.left = `${document.querySelector('.post__tabs button.active').offsetLeft}px`
            }
        })

        postInner.onclick = (e) => {
            if (e.target.closest('.post__item--heart')) {
                e.target.closest('.post__item--heart').classList.toggle('active')

                this.handleToggleLikePost(Number(e.target.closest('.post__item--heart').dataset.id))
            }
        }

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.filter__item')) {
                this.handleCloseDropdownFilter()
            }
        })
    },

    handleToggleLikePost(postId) {
        if (postId) {
            let postDb = JSON.parse(localStorage.getItem('favorites')) || []

            const postExist = postDb.find((post) => post === postId)

            if (postExist) {
                postDb = postDb.filter((post) => post !== postId)
            } else {
                postDb = [...postDb, postId]
            }

            localStorage.setItem('favorites', JSON.stringify(postDb))
        }
    },

    handleInitTabs() {
        postTabsLine.style.width = `${postTabs[0].offsetWidth}px`
    },

    handleRenderPost(posts = this.posts) {
        if (!localStorage.getItem('posts')) {
            localStorage.setItem('posts', JSON.stringify(this.posts))
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

        postInner.innerHTML = posts
            .map((post) => {
                return `
                    <div class="post__item" data-id="${post.id}">
                        <div class="post__item__image__wrapper">
                            <img
                                onerror="this.src='/static/fallback.png'"
                                src="${post.images[0]}"
                                alt=""
                            />
                            <div class="post__item__image">
                                <span>${momentTimezone(post.created_at)}</span>
                                <span> ${post.images.length} <i class="fa-solid fa-images"></i> </span>
                            </div>
                            <div class="post__item__image--overlay"></div>
                        </div>
                        <div class="post__item__info__wrapper">
                            <h3>
                                ${post.title}
                            </h3>
                            <span class="post__item__info__description">
                                <span class="post__item__info__description--bedrooms">${post.detail.bedrooms}PN</span>
                                <span class="post__item__info__description--type">${post.detail.type}</span>
                            </span>
                            <div class="post__item__info__wrapper__price__wrapper">
                                <span class="post__item__info__wrapper__price">${handleConvertPrice(
                                    post.detail.price
                                )}</span>
                                <span>${Number(post.detail.price / post.detail.area / 1000000).toFixed(2)} tr/m²</span>
                                <span>${post.detail.area}m²</span>
                            </div>
                            <span class="post__item__info__wrapper__location">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>${post.address_bd}</span>
                            </span>

                            <div class="post__item__info--user">
                                <div class="post__item__info--user__item">
                                    <img
                                        onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PyKYrBKAWWy6YCbQzWQcwIRqH8wYMPluIZiMpV1w0NYSbocTZz0ICWFkLcXhaMyvCwQ&usqp=CAU'"
                                        src="${post.user?.avatar}"
                                        alt=""
                                    />
                                    <span>${post.user?.full_name}</span>
                                </div>

                                <span class="post__item__info--user--post--length">
                                    <i class="fa-solid fa-briefcase"></i>
                                    <span>${
                                        JSON.parse(localStorage.getItem('posts')).filter((postUser) => {
                                            return post.user.id === postUser.user.id
                                        }).length
                                    } bài đăng</span>
                                </span>
                            </div>
                        </div>
                        <button class="post__item--heart" data-id="${post.id}">
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
            `
            })
            .join('')
    },

    init() {
        this.handleRenderPost(this.handleFilterPost())
        this.handleEvent()
        this.handleInitTabs()
        defaultApp.init()
    },
}

app.init()
