import defaultApp from './default.js'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency.js'
import { listenEvent, sendEvent } from './helpers/event.js'
import { getDistrict, getProvince } from './helpers/getLocations.js'
import getParentElement from './helpers/getParentElement.js'
import handleConvertPrice from './helpers/handleConvertPrice.js'
import { momentTimezone } from './helpers/momentTimezone.js'
import middleware from './middleware.js'
import { handleSetPosition } from './popperWrapper.js'
import * as postServices from './services/postService.js'
import toast from './toast.js'
import * as categoryServices from './services/categoryService.js'

const filterItemsButton = document.querySelectorAll('.filter__item--button')
const applyPriceFilterButton = document.querySelector('.price_min_max_apply')
const resetPriceFilterButton = document.querySelector('.price_min_max_reset')
const priceMinInput = document.querySelector('.price_min')
const priceMaxInput = document.querySelector('.price_max')
const filterItemDropdownButtons = document.querySelectorAll('.filter__item__dropdown--button')
const filterItemsCategoryWrapper = document.querySelector('.filter__items--category')
const removeCategoryBtn = document.querySelector('.remove__category--btn')
const postInner = document.querySelector('.post__inner')
const collapseSidebarFilterButtons = document.querySelectorAll('.sidebar__filter--collapse')
const sidebarFilterByPriceList = document.querySelectorAll('.sidebar__filter--by--price__list li')
const sidebarFilterByLocationListWrapper = document.querySelector('.sidebar__filter--by--location__list')

// tabs
const postTabs = document.querySelectorAll('.post__tabs button')
const postTabsLine = document.querySelector('.post__tabs--line')

const app = {
    posts: [],
    locations: {
        province: '',
        district: '',
        ward: '',
    },
    filters: {
        categories: '' /* sell or rent */,
        type: [], // apartment, house, land, room
        price: {
            start: 0,
            end: Infinity,
            active: false,
        },
        location: '',
    },
    filterActive: null,
    postType: 'all', // all, agent, user
    params: {
        page: 1,
        per_page: 15,
    },

    meta: null,

    // Mua bán / Giá bán
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
        applyPriceFilterButton.onclick = async () => {
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

            this.params = {
                ...this.params,
                min_price: priceMin,
                max_price: priceMax,
            }

            await this.handleFetchPost()

            this.handleRenderPost()
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
            btn.onclick = async () => {
                filterItemDropdownButtons.forEach((btn) => {
                    if (btn.dataset.parent === this.filterActive) {
                        btn.querySelector('.checkbox').classList.remove('checked')
                    }
                })

                btn.querySelector('.checkbox').classList.add('checked')

                getParentElement(btn, '.filter__item').querySelector('.filter__item--button span').textContent =
                    btn.innerText

                this.filters[btn.dataset.parent] = btn.dataset.value

                this.params = {
                    ...this.params,
                    project_type: btn.dataset.value,
                }

                await this.handleFetchPost()

                this.handleRenderPost()
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
        filterItemsCategoryWrapper.onclick = (e) => {
            if (e.target.closest('.filter__item--category')) {
                const filterItemCategoryButtons = filterItemsCategoryWrapper.querySelectorAll('.filter__item--category')

                filterItemCategoryButtons.forEach((btn) => {
                    if (e.target.closest('.filter__item--category') === btn) {
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

                        this.params = {
                            ...this.params,
                            property_categories: this.filters.type,
                        }
                        ;(async () => {
                            await this.handleFetchPost()
                            this.handleRenderPost()
                        })()
                    }
                })
            }
        }

        postTabs.forEach((btn) => {
            btn.onclick = async (e) => {
                postTabsLine.style.left = `${e.target.offsetLeft}px`
                postTabsLine.style.width = `${e.target.offsetWidth}px`

                postTabs.forEach((btn) => {
                    btn.classList.remove('active')
                })

                btn.classList.add('active')
                this.postType = btn.dataset.type

                this.params = {
                    ...this.params,
                    role: this.postType,
                }

                await this.handleFetchPost()

                this.handleRenderPost()
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

        // handle when click on heart icon
        postInner.onclick = async (e) => {
            if (e.target.closest('.post__item--heart')) {
                if (e.target.closest('.post__item')) {
                    e.preventDefault()
                    e.stopPropagation()
                }

                if (!JSON.parse(localStorage.getItem('currentUser'))) {
                    sendEvent({
                        eventName: 'modal:auth-open',
                        detail: 'loginModal',
                    })

                    return
                }

                e.target.closest('.post__item--heart').classList.toggle('active')

                await this.handleToggleLikePost(Number(e.target.closest('.post__item--heart').dataset.id))
            }
        }

        collapseSidebarFilterButtons.forEach((btn) => {
            btn.onclick = (e) => {
                if (e.target.closest(`.${btn.dataset.for}`)) {
                    e.target.closest(`.${btn.dataset.for}`).classList.toggle('active')
                }
            }
        })

        sidebarFilterByPriceList.forEach((li) => {
            li.onclick = async () => {
                document.querySelectorAll('.sidebar__filter--by--price__list li').forEach((li) => {
                    li.classList.remove('active')
                })

                li.classList.add('active')

                this.filters.price.start = Number(li.dataset.min) || 0
                this.filters.price.end = Number(li.dataset.max) || Infinity
                this.filters.price.active = true

                if (this.filters.price.start === 0 && this.filters.price.end === Infinity) {
                    delete this.params.min_price
                    delete this.params.max_price
                } else {
                    this.params = {
                        ...this.params,
                        min_price: this.filters.price.start,
                        max_price: this.filters.price.end,
                    }
                }

                await this.handleFetchPost()

                this.handleRenderPost()
            }
        })

        sidebarFilterByLocationListWrapper.onclick = async (e) => {
            if (e.target.closest('.sidebar__filter--by--location__list li')) {
                const liElement = e.target.closest('.sidebar__filter--by--location__list li')
                const value = liElement.dataset.value

                this.filters.location = value === 'all' ? '' : value

                document.querySelectorAll('.sidebar__filter--by--location__list li').forEach((li) => {
                    li.classList.remove('active')
                })

                liElement.classList.add('active')

                this.params = {
                    ...this.params,
                    location: this.filters.location,
                }

                await this.handleFetchPost()

                this.handleRenderPost()
            }
        }

        listenEvent({
            eventName: 'header:location-submit',
            handler: async ({ detail }) => {
                this.locations = detail

                await this.handleRenderSidebarFilterByLocation()

                this.filters.location = detail.province

                const addressArr = []

                for (const key in this.locations) {
                    if (this.locations[key]) {
                        addressArr.push(this.locations[key])
                    }
                }

                this.filters.location = addressArr.reverse().join(', ')

                this.params = {
                    ...this.params,
                    location: this.filters.location,
                }

                await this.handleFetchPost()

                this.handleRenderPost()
            },
        })

        listenEvent({
            eventName: 'header:location-reset',
            handler: async ({ detail }) => {
                this.locations = detail

                await this.handleRenderSidebarFilterByLocation()

                this.filters.location = detail.province

                delete this.params.location

                await this.handleFetchPost()

                this.handleRenderPost()
            },
        })

        // handle when click outside filter dropdown
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.filter__item')) {
                this.handleCloseDropdownFilter()
            }
        })

        document.querySelector('.pagination').onclick = async (e) => {
            if (e.target.closest('.pagination__page-number')) {
                const pageValue = Number(e.target.textContent)

                if (isNaN(pageValue)) {
                    return
                }

                this.params = {
                    ...this.params,
                    page: pageValue,
                }

                const { data, meta } = await postServices.getPosts({ params: this.params })

                this.meta = meta

                this.posts = data

                this.handleRenderPost()
                this.handleLoadPagination()
            }

            if (e.target.closest('.pagination__btn')) {
                const btnType = e.target.dataset.page

                if (btnType === 'prev') {
                    if (this.params.page === 1) {
                        return
                    }

                    this.params = {
                        ...this.params,
                        page: this.params.page - 1,
                    }
                } else if (btnType === 'next') {
                    if (this.params.page === this.meta?.pagination?.total_pages) {
                        return
                    }

                    this.params = {
                        ...this.params,
                        page: this.params.page + 1,
                    }
                }

                const { data, meta } = await postServices.getPosts({ params: this.params })

                this.meta = meta

                this.posts = data

                this.handleRenderPost()
                this.handleLoadPagination()
            }
        }
    },

    async handleRenderSidebarFilterByLocation() {
        let data = []

        // nếu có tỉnh thành và không có quận huyện thì lấy quận huyện
        if (this.locations.province && !this.locations.district) {
            data = await getDistrict(this.locations.province)
        } else if (this.locations.district && !this.locations.ward) {
            // nếu có quận huyện mà không có phường xã thì lấy phường xã
            const districts = await getDistrict(this.locations.province)
            data = districts.find((district) => `${district.pre} ${district.name}` === this.locations.district)?.ward
        } else {
            data = await getProvince()
        }

        if (typeof data === 'object' && !Array.isArray(data)) {
            data = Object.keys(data)
        }

        const htmls = data
            .slice(0, 15)
            .map((item) => {
                const name = item?.name ? `${item.pre} ${item.name}` : item
                return `
                    <li data-value="${name}">${name}</li>
                `
            })
            .join('')

        const allHtmls = `<li data-value="all" class="active">Tất cả</li>`

        document.querySelector('.sidebar__filter--by--location__list').innerHTML = allHtmls + htmls
    },

    async handleToggleLikePost(postId) {
        if (postId) {
            const post = this.posts.find((post) => post.id === postId)

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

            this.posts = this.posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        is_favorite: !post.is_favorite,
                    }
                }
                return post
            })
        }
    },

    handleInitTabs() {
        postTabsLine.style.width = `${postTabs[0].offsetWidth}px`
    },

    handleRenderPost() {
        if (!localStorage.getItem('posts')) {
            localStorage.setItem('posts', JSON.stringify(this.posts))
        }

        postInner.innerHTML = this.posts
            .map((post) => {
                return `
                    <a href="/details.html?post_id=${post.id}" class="post__item" data-id="${post.id}">
                        <div class="post__item__image__wrapper">
                            <img
                                onerror="this.src='/public/static/fallback.png'"
                                src="${JSON.parse(this.posts[0].images)[0]}"
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
                                <span class="post__item__info__description--bedrooms">${
                                    post.json_post_detail.bedrooms
                                }PN</span>
                                <span class="post__item__info__description--type">${post.json_category.name}</span>
                            </span>
                            <div class="post__item__info__wrapper__price__wrapper">
                                <span class="post__item__info__wrapper__price">${handleConvertPrice(
                                    post.json_post_detail.price
                                )}</span>
                                <span>${Number(
                                    post.json_post_detail.price / post.json_post_detail.area / 1000000
                                ).toFixed(2)} tr/m²</span>
                                <span>${post.json_post_detail.area}m²</span>
                            </div>
                            <span class="post__item__info__wrapper__location">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>${post.address + ' - ' + post.administrative_address}</span>
                            </span>

                            <div class="post__item__info--user">
                                <div class="post__item__info--user__item">
                                    <img
                                        onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PyKYrBKAWWy6YCbQzWQcwIRqH8wYMPluIZiMpV1w0NYSbocTZz0ICWFkLcXhaMyvCwQ&usqp=CAU'"
                                        src="${post.json_user.avatar || ''}"
                                        alt=""
                                    />
                                    <span>${post.json_user.full_name}</span>
                                </div>

                                <span class="post__item__info--user--post--length">
                                    <i class="fa-solid fa-briefcase"></i>
                                    <span>${post.json_user.post_count} bài đăng</span>
                                </span>
                            </div>
                        </div>
                        <button class="post__item--heart ${post.is_favorite ? 'active' : ''}" data-id="${post.id}">
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </a>
            `
            })
            .join('')
    },

    async handleLoadCategory() {
        try {
            const { data: categories } = await categoryServices.getCategories()

            const htmls = categories.map((category) => {
                return `
                <button class="filter__item--category" data-type="${category.key}">
                    <span>${category.name}</span>
                </button>
            `
            })

            document.querySelector('.filter__items--category').innerHTML = htmls.join('')
        } catch (error) {
            toast({
                message: error.message,
                type: 'error',
            })
        }
    },

    async handleFetchPost() {
        try {
            const { data, meta } = await postServices.getPosts({ params: this.params })

            this.posts = data
            this.meta = meta
        } catch (error) {
            toast({
                message: error.message,
                type: 'error',
            })
        }
    },

    handleLoadPagination() {
        const {
            pagination: { total_pages },
        } = this.meta

        let pages = []

        if (total_pages <= 8) {
            for (let i = 1; i <= total_pages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1, 2, 3, 4, '...', total_pages - 3, total_pages - 2, total_pages - 1, total_pages)
        }

        document.querySelector('.pagination__pages-numbers').innerHTML = pages
            .map((page) => {
                return `
                    <span class="pagination__page-number ${
                        this.params.page === page ? 'active' : ''
                    }" data-page="${page}">${page}</span>
                `
            })
            .join('')
    },

    async init() {
        await middleware()
        await this.handleFetchPost()
        await this.handleRenderSidebarFilterByLocation()
        this.handleRenderPost()
        await this.handleLoadCategory()
        this.handleLoadPagination()
        this.handleEvent()
        this.handleInitTabs()
        defaultApp.init()
    },
}

app.init()
