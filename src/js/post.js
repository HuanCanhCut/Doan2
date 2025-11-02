import Validator from './Validator'
import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import locationsDropdownApp from './locationsDropdown'
import toast from './toast'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency'
import convertConcurrency from './helpers/convertConcurrency'
import getUrlSearchParams from './helpers/getURLSearchParams'

const categoryBtnsOption = document.querySelectorAll('.post__form__radio')
const roleBtnsOption = document.querySelectorAll('.post__form__role')
const imgInput = document.querySelector('#post__images')
const imgUploadAreaPreview = document.querySelector('.post__images--upload--area--preview')
const concurrencyInputs = document.querySelectorAll('input[data-concurrency]')
const propertyCategorySelect = document.querySelector('#property-category')

const postApp = {
    postId: getUrlSearchParams('post_id'),
    postType: getUrlSearchParams('type'),

    locations: null,
    categoryType: 'sell', // sell or rent
    roleType: 'personal', // personal or agent
    imagesFiles: [],
    propertyCategory: 'apartment', // apartment, house, land, room

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
                Validator.isRequired('#legal_documents'),
                Validator.isRequired('#area'),
                Validator.isNumber('#area'),
                Validator.isRequired('#price'),
                Validator.isNumber('#price'),
                Validator.isNumber('#deposit'),
                Validator.smallerThan('#deposit', '#price', 'Số tiền cọc phải nhỏ hơn giá thuê'),
                Validator.isRequired('#title'),
                Validator.isRequired('#description'),
            ],
            submit: async (data) => {
                if (this.imagesFiles.length === 0) {
                    toast({
                        title: 'Cảnh báo',
                        message: 'Vui lòng tải lên ít nhất 1 ảnh',
                        type: 'error',
                    })

                    return
                }

                for (const key in data) {
                    if (document.querySelector(`[name="${key}"]`).getAttribute('price')) {
                        data[key] = data[key].split('.').join('')
                    }
                }

                const newData = {}

                for (const key in data) {
                    if (document.querySelector(`[name="${key}"]`).dataset.detail) {
                        if (!newData['detail']) {
                            newData['detail'] = {}
                        }

                        newData['detail'][key] = data[key]
                    } else {
                        newData[key] = data[key]
                    }
                }

                const postUser = JSON.parse(localStorage.getItem('currentUser'))

                const postDb = JSON.parse(localStorage.getItem('posts')) || []

                if (this.postType === 'edit') {
                    const newPosts = postDb.map((post) => {
                        if (post.id === Number(this.postId)) {
                            return {
                                id: Number(this.postId),
                                ...newData,
                                property_category: this.propertyCategory,
                                role: this.roleType,
                                images: this.imagesFiles.map(
                                    () => 'https://thichtrangtri.com/wp-content/uploads/2025/05/anh-meo-gian-cute-3.jpg'
                                ),
                                project_type: this.categoryType,
                                user_id: post.user_id,
                                post_status: 'pending', // pending, approved, rejected
                                created_at: post.created_at,
                                updated_at: new Date(),
                            }
                        }

                        return post
                    })

                    localStorage.setItem('posts', JSON.stringify(newPosts))

                    toast({
                        title: 'Thành công',
                        message: 'Tin của bạn đã được cập nhật thành công',
                        type: 'success',
                    })
                } else {
                    const updatedData = {
                        id: postDb.length > 0 ? postDb[postDb.length - 1].id + 1 : 1,
                        ...newData,
                        property_category: this.propertyCategory,
                        role: this.roleType,
                        images: this.imagesFiles.map(
                            () => 'https://thichtrangtri.com/wp-content/uploads/2025/05/anh-meo-gian-cute-3.jpg'
                        ),
                        project_type: this.categoryType,
                        user_id: postUser.id,
                        post_status: 'pending', // pending, approved, rejected
                        created_at: new Date(),
                        updated_at: new Date(),
                    }

                    postDb.push(updatedData)

                    localStorage.setItem('posts', JSON.stringify(postDb))

                    toast({
                        title: 'Thành công',
                        message: 'Tin của bạn đã được đăng tải thành công',
                        type: 'success',
                    })
                }

                document.querySelectorAll('input[name]').forEach((input) => {
                    input.value = ''
                })

                document.querySelectorAll('textarea[name]').forEach((textarea) => {
                    textarea.value = ''
                })

                this.imagesFiles = []

                this.handleLoadImagesPreview()

                document.querySelectorAll('.form-concurrency-converted').forEach((span) => {
                    span.textContent = null
                })
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
            const categoryMapping = {
                sell: 'Giá bán',
                rent: 'Giá thuê',
            }

            btn.onclick = () => {
                categoryBtnsOption.forEach((btn) => {
                    btn.classList.remove('active')
                })

                btn.classList.add('active')
                this.categoryType = btn.dataset.type

                document.querySelector('label[for="price"]').innerHTML = `${
                    categoryMapping[btn.dataset.type]
                } <span class="field--required">*</span>`
            }
        })

        propertyCategorySelect.onchange = (e) => {
            this.propertyCategory = e.target.value
        }

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

        concurrencyInputs.forEach((input) => {
            input.oninput = (e) => {
                const value = e.target.value

                input.value = value.replace(/[^0-9]/g, '')

                let formatted = convertConcurrencyToNumber(Number(value.split('.').join(''))) || e.target.value

                const parentElement = getParentElement(input, '.form-group')

                if (formatted === '0') {
                    formatted = ''
                    parentElement.querySelector('.form-concurrency-converted').innerText = ''
                } else {
                    if (formatted === 'NaN') {
                        input.value = e.target.value
                    } else {
                        input.value = formatted

                        parentElement.querySelector('.form-concurrency-converted').innerText = convertConcurrency(
                            Number(formatted.split('.').join(''))
                        )
                    }
                }
            }
        })
    },

    fillFormData() {
        if (this.postType === 'edit') {
            const post = JSON.parse(localStorage.getItem('posts'))?.find((post) => post.id === Number(this.postId))

            if (post) {
                document.querySelector('.post__form__select').value = post.property_category

                this.categoryType = post.project_type
                this.propertyCategory = post.property_category
                this.imagesFiles = post.images.map((image) => {
                    return {
                        preview: image,
                    }
                })

                this.handleLoadImagesPreview()

                // set category type
                document.querySelector('.post__form__radio.active').classList.remove('active')

                document.querySelector(`.post__form__radio[data-type="${post.project_type}"]`).classList.add('active')

                // set role
                document.querySelector('.post__form__role.active').classList.remove('active')

                document.querySelector(`.post__form__role[data-type="${post.role}"]`).classList.add('active')

                this.roleType = post.role

                for (const key in post) {
                    const input = document.querySelector(`input[name="${key}"]`)
                    const textarea = document.querySelector(`textarea[name="${key}"]`)

                    if (input) {
                        input.value = post[key]
                    }

                    if (textarea) {
                        textarea.value = post[key]
                    }
                }

                for (const key in post.detail) {
                    const input = document.querySelector(`input[name="${key}"]`)

                    if (input) {
                        input.value = post.detail[key]
                    }
                }

                document.querySelector('.post__form__submit').textContent = 'Cập nhật'
            }
        }
    },

    init() {
        defaultApp.init()
        new locationsDropdownApp(
            document.querySelector('#form__location'),
            this.postType === 'edit'
                ? (() => {
                      const post = JSON.parse(localStorage.getItem('posts'))?.find(
                          (post) => post.id === Number(this.postId)
                      )

                      const [ward, district, province] = post.address_bd.split(' - ')

                      return {
                          province,
                          district,
                          ward,
                      }
                  })()
                : null
        ).init(this.handleSubmitLocation.bind(this))

        // if mode is edit, fill form data
        this.fillFormData()
        this.handleValidator()
        this.handleEvent()
    },
}

postApp.init()
