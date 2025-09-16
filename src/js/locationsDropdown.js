import toast from './toast'

const locationsDropdownBtn = document.querySelector('.header__province__dropdown')
const locationsDropdownSelect = document.querySelector('.header__province__dropdown__select')
const locationsDropdownPopperWrapper = document.querySelector('.header__province__dropdown__select__popper--wrapper')
const selectLocation = document.querySelectorAll('.header__province__dropdown__select__popper__content')
const locationOptionsWrappers = document.querySelectorAll('#location__options__wrapper')
const locationsBackBtns = document.querySelectorAll('.province__options__header button')

const locationsDropdownApp = {
    locations: {
        province: '',
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

    async handleFetchProvince() {
        const response = await fetch('/locations/index.json')
        return await response.json()
    },

    async handleFetchDistrict(provinceName) {
        const provinces = await this.handleFetchProvince()

        const filePath = provinces[provinceName]?.file_path

        const response = await fetch(filePath)
        const data = await response.json()

        return data.district
    },

    async handleSelectLocation(item) {
        const type = item.dataset.type

        const provinceOptionsList = document.querySelector(`.province__options__list[data-type="${type}"]`)

        let data = []

        switch (type) {
            case 'province':
                {
                    const provinces = await this.handleFetchProvince()

                    data = Object.keys(provinces)
                }

                break
            case 'district':
                {
                    if (!this.locations.province) {
                        toast({
                            title: 'Cảnh báo',
                            message: 'Vui lòng chọn tỉnh/thành phố trước',
                            type: 'error',
                        })

                        return
                    }

                    const districts = await this.handleFetchDistrict(this.locations.province)

                    data = districts
                }
                break
            case 'ward':
                {
                    if (!this.locations.province) {
                        toast({
                            title: 'Cảnh báo',
                            message: 'Vui lòng chọn tỉnh/thành phố trước',
                            type: 'error',
                            duration: 1500,
                        })

                        return
                    }

                    if (!this.locations.district) {
                        toast({
                            title: 'Cảnh báo',
                            message: 'Vui lòng chọn quận/huyện trước',
                            type: 'error',
                            duration: 1500,
                        })

                        return
                    }

                    const districts = await this.handleFetchDistrict(this.locations.province)

                    const wards = districts.find((district) => district.name === this.locations.district)?.ward

                    if (!wards) {
                        toast({
                            title: 'Cảnh báo',
                            message: 'Vui lòng chọn tỉnh/thành phố trước',
                            type: 'error',
                        })

                        return
                    }

                    data = wards
                }
                break
            default:
                break
        }

        provinceOptionsList.innerHTML = data
            .map((item) => {
                return `
                    <li class="province__options__list--item" data-value="${item.name ? item.name : item}">
                        <button>${item.name ? `${item.pre} ${item.name}` : item}</button>
                        <div class="province__options__list--item--checkbox ${
                            this.locations[type].normalize() === (item.name ? item.name.normalize() : item.normalize())
                                ? 'checked'
                                : ''
                        }"></div>
                    </li>
                `
            })
            .join('')

        const provinceOptionsListItems = provinceOptionsList.querySelectorAll('.province__options__list--item')

        provinceOptionsListItems.forEach((item) => {
            item.addEventListener('click', () => {
                const permissionRemove = {
                    province: ['district', 'ward'],
                    district: ['ward'],
                    ward: [],
                }

                permissionRemove[type].forEach((locationType) => {
                    const selectedLocationName = item.dataset.value

                    if (selectedLocationName !== this.locations[type]) {
                        this.locations[locationType] = ''
                    }
                })

                this.locations[type] = item.dataset.value

                locationOptionsWrappers.forEach((location) => {
                    location.classList.remove('active')
                })

                locationsDropdownPopperWrapper.classList.add('active')

                this.loadSelectedLocation()
            })
        })

        locationOptionsWrappers.forEach((location) => {
            if (location.dataset.type === type) {
                location.classList.toggle('active')
            } else {
                location.classList.remove('active')
            }
        })

        locationsDropdownPopperWrapper.classList.remove('active')
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
            item.addEventListener('click', async () => {
                await this.handleSelectLocation(item)
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
    },
}

export default locationsDropdownApp
