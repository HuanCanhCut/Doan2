const locationsDropdownBtn = document.querySelector('.header__province__dropdown')
const locationsDropdownSelect = document.querySelector('.header__province__dropdown__select')
const locationsDropdownPopperWrapper = document.querySelector('.header__province__dropdown__select__popper--wrapper')
const selectLocation = document.querySelectorAll('.header__province__dropdown__select__popper__content')
const locationOptionsWrappers = document.querySelectorAll('#location__options__wrapper')
const locationsBackBtns = document.querySelectorAll('.province__options__header button')

const locationsDropdownApp = {
    locations: {
        province: 'Hà Nội',
        district: '',
        ward: '',
    },

    loadSelectedLocation() {
        const locationSelectedValues = document.querySelectorAll(
            '.header__province__dropdown__select__popper__content__value'
        )

        locationSelectedValues.forEach((item) => {
            item.textContent = this.locations[item.dataset.type]
        })
    },

    handleSelectLocation() {
        //
    },

    handleClickOutsideLocationsDropdown() {
        locationsDropdownSelect.classList.remove('active')

        locationsDropdownPopperWrapper.classList.add('active')

        locationOptionsWrappers.forEach((location) => {
            location.classList.remove('active')
        })
    },

    handleEvent() {
        locationsDropdownBtn.onclick = () => {
            locationsDropdownSelect.classList.toggle('active')
        }

        selectLocation.forEach((item) => {
            item.addEventListener('click', () => {
                const type = item.dataset.type

                switch (type) {
                    case 'province':
                        ;(async () => {
                            const response = await fetch('/locations/index.json')
                            const provinces = await response.json()

                            const provinceOptionsList = document.querySelector(
                                `.province__options__list[data-type="${type}"]`
                            )

                            provinceOptionsList.innerHTML = Object.keys(provinces)
                                .map((key) => {
                                    return `
                                    <li class="province__options__list--item" data-value="${key}">
                                        <button>${key}</button>
                                        <div class="province__options__list--item--checkbox ${
                                            this.locations.province.normalize() === key.normalize() ? 'checked' : ''
                                        }"></div>
                                    </li>
                                `
                                })
                                .join('')

                            const provinceOptionsListItems = provinceOptionsList.querySelectorAll(
                                '.province__options__list--item'
                            )

                            provinceOptionsListItems.forEach((item) => {
                                item.addEventListener('click', () => {
                                    this.locations.province = item.dataset.value

                                    locationOptionsWrappers.forEach((location) => {
                                        location.classList.remove('active')
                                    })

                                    locationsDropdownPopperWrapper.classList.add('active')

                                    this.loadSelectedLocation()
                                })
                            })
                        })()

                        break
                    case 'district':
                        break
                    case 'ward':
                        break
                    default:
                        break
                }

                locationOptionsWrappers.forEach((location) => {
                    if (location.dataset.type === type) {
                        location.classList.toggle('active')
                    } else {
                        location.classList.remove('active')
                    }
                })

                locationsDropdownPopperWrapper.classList.remove('active')
            })
        })

        locationsBackBtns.forEach((btn) => {
            btn.onclick = () => {
                locationOptionsWrappers.forEach((location) => {
                    location.classList.remove('active')
                })

                locationsDropdownPopperWrapper.classList.add('active')
            }
        })

        // handle click outside popper
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.header__province')) {
                this.handleClickOutsideLocationsDropdown()
            }
        })

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleClickOutsideLocationsDropdown()
            }
        })
    },

    init() {
        this.handleEvent()
        this.loadSelectedLocation()
        this.handleSelectLocation()
    },
}

export default locationsDropdownApp
