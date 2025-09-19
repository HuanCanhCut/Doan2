import toast from './toast'

class locationsDropdownApp {
    constructor() {
        this.locations = {
            province: '',
            district: '',
            ward: '',
        }
    }

    loadSelectedLocation(root) {
        const locationSelectedValues = root.querySelectorAll('.province__dropdown__select__popper__content__value')

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

    async handleSelectLocation(item, root) {
        const type = item.dataset.type

        const provinceOptionsList = root.querySelector(`.province__options__list[data-type="${type}"]`)

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

        provinceOptionsList.innerHTML = data
            .map((item) => {
                return `
                    <li class="province__options__list--item" data-value="${
                        item.name ? `${item.pre} ${item.name}` : item
                    }">
                        <button type="button">${item.name ? `${item.pre} ${item.name}` : item}</button>
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

                root.querySelectorAll('#location__options__wrapper').forEach((location) => {
                    location.classList.remove('active')
                })

                root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')

                this.loadSelectedLocation(root)
            })
        })

        root.querySelectorAll('#location__options__wrapper').forEach((location) => {
            if (location.dataset.type === type) {
                location.classList.toggle('active')
            } else {
                location.classList.remove('active')
            }
        })

        root.querySelector('.province__dropdown__select__popper--wrapper').classList.remove('active')
    }

    handleClickOutsideLocationsDropdown(root) {
        root.querySelector('.province__dropdown__select').classList.remove('active')

        root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')

        root.querySelectorAll('#location__options__wrapper').forEach((location) => {
            location.classList.remove('active')
        })
    }

    handleEvent(root, onSubmit) {
        root.querySelector('.province__dropdown').onclick = () => {
            root.querySelector('.province__dropdown__select').classList.toggle('active')
        }

        root.querySelectorAll('.province__dropdown__select__popper__content').forEach((item) => {
            item.addEventListener('click', async () => {
                await this.handleSelectLocation(item, root)
            })
        })

        root.querySelectorAll('.province__options__header button').forEach((btn) => {
            btn.onclick = () => {
                root.querySelectorAll('#location__options__wrapper').forEach((location) => {
                    location.classList.remove('active')
                })

                root.querySelector('.province__dropdown__select__popper--wrapper').classList.add('active')
            }
        })

        root.querySelector('.province__dropdown__actions--button').onclick = () => {
            onSubmit(this.getLocations())
            this.handleClickOutsideLocationsDropdown(root)
        }

        // handle click outside popper
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.province')) {
                this.handleClickOutsideLocationsDropdown(root)
            }
        })

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleClickOutsideLocationsDropdown(root)
            }
        })
    }

    getLocations() {
        return this.locations
    }

    init({ root, onSubmit = () => {} }) {
        this.handleEvent(root, onSubmit)
        this.loadSelectedLocation(root)
    }
}

export default locationsDropdownApp
