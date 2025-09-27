import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import './popperWrapper'
import { handleSetPosition } from './popperWrapper'

const filterItemsButton = document.querySelectorAll('.filter__item--button')

const app = {
    filters: {
        categories: 'buy-sell' /* buy-sell or rent */,
        type: null,
        price: {
            start: 0,
            end: Infinity,
            active: false,
        },
    },

    filterActive: null,

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

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.filter__item')) {
                filterItemsButton.forEach((btn) => {
                    const parentElement = btn.parentElement

                    parentElement.classList.remove('active')

                    parentElement.querySelector('.filter__item__dropdown').classList.remove('active')

                    this.filterActive = null
                })
            }
        })
    },

    init() {
        this.handleEvent()
        defaultApp.init()
    },
}

app.init()
