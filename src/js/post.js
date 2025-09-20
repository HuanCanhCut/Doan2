import Validator from './Validator'
import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import locationsDropdownApp from './locationsDropdown'

const categoryBtnsOption = document.querySelectorAll('.post__form__radio')
const roleBtnsOption = document.querySelectorAll('.post__form__role')
const imgInput = document.querySelector('#post__images')
const imgUploadAreaPreview = document.querySelector('.post__images--upload--area--preview')

const postApp = {
    locations: null,
    categoryType: 'sell', // sell or rent
    roleType: 'seller', // seller or agent
    imagesFiles: [],

    handleValidator() {
        Validator({
            form: '#post__form',
            errorSelector: '.form-message',
            formGroup: '.form-group',
            rules: [
                Validator.isRequired('#type'),
                Validator.isRequired('#bedrooms'),
                Validator.isNumber('#bedrooms'),
                Validator.isRequired('#bathrooms'),
                Validator.isNumber('#bathrooms'),
                Validator.isRequired('#legal-documents'),
                Validator.isRequired('#area'),
                Validator.isNumber('#area'),
                Validator.isRequired('#rent-price'),
                Validator.isRequired('#title'),
                Validator.isRequired('#description'),
            ],
            submit: async (data) => {
                console.log(data)
            },
        })
    },

    handleSubmitLocation(locations) {
        this.locations = locations
        const addressBd = document.querySelector('#address_bd')

        const addressArr = []

        for (const key in locations) {
            if (locations[key]) {
                addressArr.push(locations[key])
            }
        }

        addressBd.value = addressArr.reverse().join(' - ')

        const formMessage = getParentElement(addressBd, '.form-group').querySelector('.form-message')

        if (addressArr.length !== 3) {
            formMessage.innerText = 'Vui lòng chọn đầy đủ địa chỉ BDS'
        } else {
            formMessage.innerText = ''
        }
    },

    handleLoadImagesPreview() {
        const uploadArea = document.querySelector('.post__images--upload--area:not(.uploaded)')
        uploadArea.style.display = this.imagesFiles.length > 0 ? 'none' : 'flex'

        imgUploadAreaPreview.style.display = this.imagesFiles.length > 0 ? 'flex' : 'none'

        // first value is upload area
        const renderValue = ['', ...this.imagesFiles]

        imgUploadAreaPreview.innerHTML = renderValue
            .map((image, index) => {
                if (index === 0) {
                    return `
                    <label for="post__images" class="post__images--upload--area uploaded">
                        <i class="fa-solid fa-plus"></i>
                    </label>
                `
                }

                return `
                <div class="post__images--upload--area--preview__item">
                    <img
                        src="${image.preview}"
                        alt=""
                    />
                    <button class="post__images--upload--area--preview__item__remove" data-index="${index - 1}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `
            })
            .join('')
    },

    handleEvent() {
        categoryBtnsOption.forEach((btn) => {
            btn.onclick = () => {
                categoryBtnsOption.forEach((btn) => {
                    btn.classList.remove('active')
                })

                btn.classList.add('active')
                this.categoryType = btn.dataset.type
            }
        })

        roleBtnsOption.forEach((btn) => {
            btn.onclick = () => {
                roleBtnsOption.forEach((btn) => {
                    btn.classList.remove('active')
                })

                btn.classList.add('active')
                this.roleType = btn.dataset.type
            }
        })

        imgInput.onchange = (e) => {
            const files = e.target.files

            if (files?.length) {
                Array.from(files).forEach((file, index) => {
                    if (this.imagesFiles.length >= 12 || index >= 12) {
                        return
                    }

                    file.preview = URL.createObjectURL(file)
                    this.imagesFiles.push(file)
                })
            }

            // allow user to upload multiple images same name
            e.target.value = ''

            this.handleLoadImagesPreview()
        }

        imgUploadAreaPreview.onclick = (e) => {
            if (e.target.closest('.post__images--upload--area--preview__item__remove')) {
                const btn = getParentElement(e.target, '.post__images--upload--area--preview__item__remove')

                const imageIndex = btn.dataset.index

                this.imagesFiles.splice(imageIndex, 1)
                this.handleLoadImagesPreview()
            }
        }
    },

    init() {
        defaultApp.init()
        new locationsDropdownApp().init({
            root: document.querySelector('#form__location'),
            onSubmit: this.handleSubmitLocation.bind(this),
        })
        this.handleValidator()
        this.handleEvent()
    },
}

postApp.init()
