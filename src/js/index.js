import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency'
import './popperWrapper'
import { handleSetPosition } from './popperWrapper'

const filterItemsButton = document.querySelectorAll('.filter__item--button')
const applyPriceFilterButton = document.querySelector('.price_min_max_apply')
const resetPriceFilterButton = document.querySelector('.price_min_max_reset')
const priceMinInput = document.querySelector('.price_min')
const priceMaxInput = document.querySelector('.price_max')
const filterItemDropdownButtons = document.querySelectorAll('.filter__item__dropdown--button')
const filterItemCategoryButtons = document.querySelectorAll('.filter__item--category')
const removeCategoryBtn = document.querySelector('.remove__category--btn')

// tabs
const postTabs = document.querySelectorAll('.post__tabs button')
const postTabsLine = document.querySelector('.post__tabs--line')

const app = {
    filters: {
        categories: 'buy-sell' /* buy-sell or rent */,
        type: '',
        price: {
            start: 0,
            end: Infinity,
            active: false,
        },
    },

    filterActive: null,

    postType: '', // all, agent, personal

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
        }

        resetPriceFilterButton.onclick = () => {
            this.filters.price.active = false

            this.handleCloseDropdownFilter()
        }

        Array.from([priceMinInput, priceMaxInput]).forEach((input) => {
            input.oninput = (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                e.target.value = convertConcurrencyToNumber(Number(e.target.value.split('.').join('')))
            }
        })

        filterItemDropdownButtons.forEach((btn) => {
            btn.onclick = () => {
                filterItemDropdownButtons.forEach((btn) => {
                    if (btn.dataset.parent === this.filterActive) {
                        btn.querySelector('.checkbox').classList.remove('checked')
                    }
                })

                btn.querySelector('.checkbox').classList.add('checked')

                this.filters[btn.dataset.parent] = btn.dataset.value
            }
        })

        removeCategoryBtn.onclick = () => {
            this.filters.categories = ''

            getParentElement(removeCategoryBtn, '.filter__item')
                .querySelectorAll('.checkbox')
                .forEach((checkbox) => {
                    checkbox.classList.remove('checked')
                })

            this.handleCloseDropdownFilter()
        }

        filterItemCategoryButtons.forEach((btn) => {
            btn.onclick = () => {
                this.filters.type = btn.dataset.type

                filterItemCategoryButtons.forEach((btn) => {
                    if (btn.classList.contains('active')) {
                        return
                    }

                    btn.classList.remove('active')
                })

                btn.classList.toggle('active')
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

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.filter__item')) {
                this.handleCloseDropdownFilter()
            }
        })
    },

    handleInitTabs() {
        postTabsLine.style.width = `${postTabs[0].offsetWidth}px`
    },

    init() {
        this.handleEvent()
        this.handleInitTabs()
        defaultApp.init()
    },
}

app.init()
