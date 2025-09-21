import toast from './toast'

class locationsDropdownApp {
    constructor(root) {
        this.root = root
        this.locations = {
            province: '',
            district: '',
            ward: '',
        }
    }

    loadSelectedLocation() {
        const locationSelectedValues = this.root.querySelectorAll('.province__dropdown__select__popper__content__value')

        locationSelectedValues.forEach((item) => {
            item.textContent = this.locations[item.dataset.type]
        })
    }

    async handleFetchProvince() {
        const response = await fetch('/locations/index.json')
        return await response.json()
    }

    async handleFetchDistrict(provinceName) {
        const provinces = await this.handleFetchProvince()

        const filePath = provinces[provinceName]?.file_path

        const response = await fetch(filePath)
        const data = await response.json()

        return data.district
    }

    handleRenderOptions(data, type) {
        return data
            .map((item) => {
                return `
                    <li class="province__options__list--item" data-value="${
                        item.name ? `${item.pre} ${item.name}` : item
                    }">
                        <button type="button">${item.name ? `${item.pre} ${item.name}` : item}</button>
                        <div class="province__options__list--item--checkbox ${
                            this.locations[type].normalize() ===
                            (item.name ? `${item.pre} ${item.name}` : item.normalize())
                                ? 'checked'
                                : ''
                        }"></div>
                    </li>
            `
            })
            .join('')
    }

    handleClickOption(provinceOptionsListItems, type) {
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

                this.root.querySelectorAll('#location__options__wrapper').forEach((location) => {
                    location.classList.remove('active')
                })

                this.root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')

                this.loadSelectedLocation()
            })
        })
    }

    async handleSelectLocation(item) {
        const type = item.dataset.type

        const provinceOptionsList = this.root.querySelector(`.province__options__list[data-type="${type}"]`)

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

                    const wards = districts.find(
                        (district) => `${district.pre} ${district.name}` === this.locations.district
                    )?.ward

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

        provinceOptionsList.innerHTML = this.handleRenderOptions(data, type)

        const provinceOptionsListItems = provinceOptionsList.querySelectorAll('.province__options__list--item')

        this.handleClickOption(provinceOptionsListItems, type)

        this.root.querySelectorAll('#location__options__wrapper').forEach((location) => {
            if (location.dataset.type === type) {
                location.classList.toggle('active')
            } else {
                location.classList.remove('active')
            }
        })

        this.root.querySelector('.province__dropdown__select__popper--wrapper').classList.remove('active')

        const searchInput = this.root.querySelector(`.province__options__search input[data-type="${type}"]`)

        searchInput.focus()

        searchInput.oninput = (e) => {
            if (e.target.value.length === 0) {
                provinceOptionsList.innerHTML = this.handleRenderOptions(data, type)

                const provinceOptionsListItems = provinceOptionsList.querySelectorAll('.province__options__list--item')

                this.handleClickOption(provinceOptionsListItems, type)

                return
            }

            const newData = data.filter((item) => {
                // province
                if (typeof item === 'string') {
                    return item.toLowerCase().normalize().includes(e.target.value.toLowerCase().normalize())
                } else {
                    return (
                        item.pre.toLowerCase().normalize().includes(e.target.value.toLowerCase().normalize()) ||
                        item.name.toLowerCase().normalize().includes(e.target.value.toLowerCase().normalize()) ||
                        (item.pre + ' ' + item.name)
                            .toLowerCase()
                            .normalize()
                            .includes(e.target.value.toLowerCase().normalize())
                    )
                }
            })

            provinceOptionsList.innerHTML = this.handleRenderOptions(newData, type)

            const provinceOptionsListItems = provinceOptionsList.querySelectorAll('.province__options__list--item')

            this.handleClickOption(provinceOptionsListItems, type)
        }
    }

    handleClickOutsideLocationsDropdown() {
        this.root.querySelector('.province__dropdown__select').classList.remove('active')

        this.root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')

        this.root.querySelectorAll('#location__options__wrapper').forEach((location) => {
            location.classList.remove('active')
        })
    }

    handleEvent(onSubmit) {
        this.root.querySelector('.province__dropdown').onclick = () => {
            this.root.querySelector('.province__dropdown__select').classList.toggle('active')
        }

        this.root.querySelectorAll('.province__dropdown__select__popper__content').forEach((item) => {
            item.addEventListener('click', async () => {
                await this.handleSelectLocation(item)
            })
        })

        this.root.querySelectorAll('.province__options__header button').forEach((btn) => {
            btn.onclick = () => {
                this.root.querySelectorAll('#location__options__wrapper').forEach((location) => {
                    location.classList.remove('active')
                })

                this.root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')
            }
        })

        this.root.querySelector('.province__dropdown__actions--button').onclick = () => {
            onSubmit(this.getLocations())
            this.handleClickOutsideLocationsDropdown()
        }

        // handle click outside popper
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.province')) {
                this.handleClickOutsideLocationsDropdown()
            }
        })

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleClickOutsideLocationsDropdown()
            }
        })
    }

    getLocations() {
        return this.locations
    }

    init(onSubmit = () => {}) {
        this.handleEvent(onSubmit)
        this.loadSelectedLocation()
    }
}

export default locationsDropdownApp
