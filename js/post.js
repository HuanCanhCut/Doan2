import Validator from './Validator.js'
import defaultApp from './default.js'
import getParentElement from './helpers/getParentElement.js'
import locationsDropdownApp from './locationsDropdown.js'
import toast from './toast.js'
import { convertConcurrencyToNumber } from './helpers/convertConcurrency.js'
import convertConcurrency from './helpers/convertConcurrency.js'
import getUrlSearchParams from './helpers/getURLSearchParams.js'
import middleware from './middleware.js'
import uploadToCloudinary from './helpers/uploadToCloudinary.js'
import * as categoriesServices from './services/categoryService.js'
import * as postsServices from './services/postService.js'

const categoryBtnsOption = document.querySelectorAll('.post__form__radio')
const roleBtnsOption = document.querySelectorAll('.post__form__role')
const imgInput = document.querySelector('#post__images')
const imgUploadAreaPreview = document.querySelector('.post__images--upload--area--preview')
const concurrencyInputs = document.querySelectorAll('input[data-concurrency]')
const propertyCategorySelect = document.querySelector('#property-category')

const postApp = {
    posts: [],
    postId: getUrlSearchParams('post_id'),
    postType: getUrlSearchParams('type'),

    locations: null,
    categoryType: 'sell', // sell or rent
    roleType: 'user', // user or agent
    imagesFiles: [],
    categoryId: 1,

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
                try {
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
                        if (document.querySelector(`[name="${key}"]`).dataset.details) {
                            if (!newData['details']) {
                                newData['details'] = {}
                            }

                            newData['details'][key] = data[key]
                        } else {
                            newData[key] = data[key]
                        }
                    }

                    const postUser = JSON.parse(localStorage.getItem('currentUser'))

                    const images = await Promise.all(
                        this.imagesFiles.map(async (image) => {
                            if (image instanceof File) {
                                const response = await uploadToCloudinary(
                                    image,
                                    'real_estate',
                                    `${image.name}-${window.crypto.randomUUID()}`
                                )
                                return response.secure_url
                            }

                            return image
                        })
                    )

                    if (this.postType === 'edit') {
                        const updatedData = {
                            ...newData,
                            category_id: this.categoryId,
                            role: this.roleType,
                            images: JSON.stringify(images),
                            project_type: this.categoryType,
                            user_id: postUser.id,
                        }

                        await postsServices.updatePost(this.postId, updatedData)

                        toast({
                            title: 'Thành công',
                            message: 'Tin của bạn đã được cập nhật thành công',
                            type: 'success',
                        })
                    } else {
                        const createPostData = {
                            ...newData,
                            category_id: this.categoryId,
                            role: this.roleType,
                            images: JSON.stringify(images),
                            project_type: this.categoryType,
                            user_id: postUser.id,
                        }

                        await postsServices.createPost(createPostData)

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
                } catch (error) {
                    console.error(error)

                    toast({
                        title: 'Lỗi',
                        message: error.message,
                        type: 'error',
                    })
                }
            },
        })
    },

    handleSubmitLocation(locations) {
        this.locations = locations
        const administrativeAddress = document.querySelector('#administrative_address')

        const addressArr = []

        for (const key in locations) {
            if (locations[key]) {
                addressArr.push(locations[key])
            }
        }

        administrativeAddress.value = addressArr.reverse().join(', ')

        const formMessage = getParentElement(administrativeAddress, '.form-group').querySelector('.form-message')

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
            this.categoryId = e.target.value
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

    async fillFormData() {
        if (this.postType === 'edit') {
            try {
                const { data: post } = await postsServices.getPostById(this.postId)

                if (post) {
                    this.categoryId = post.json_category.id
                    document.querySelector('.post__form__select').value = post.json_category.id

                    this.categoryType = post.project_type
                    this.categoryId = post.json_category.id
                    this.imagesFiles = JSON.parse(post.images).map((image) => {
                        return {
                            preview: image,
                        }
                    })

                    this.handleLoadImagesPreview()

                    // set category type
                    document.querySelector('.post__form__radio.active').classList.remove('active')

                    document
                        .querySelector(`.post__form__radio[data-type="${post.project_type}"]`)
                        .classList.add('active')

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

                    for (const key in post.json_post_detail) {
                        const input = document.querySelector(`input[name="${key}"]`)

                        if (input) {
                            // by default, data type is decimal (14, 2), so we need split two numbers of the decimal part
                            if (input.getAttribute('price')) {
                                input.value = convertConcurrencyToNumber(
                                    Number(post.json_post_detail[key].split('.')[0])
                                )
                            } else {
                                input.value = post.json_post_detail[key]
                            }
                        }
                    }

                    document.querySelector('.post__form__submit').textContent = 'Cập nhật'
                }
            } catch (error) {
                toast({
                    title: 'Lỗi',
                    message: error.message,
                    type: 'error',
                })
            }
        }
    },

    async handleLoadCategory() {
        try {
            const { data: categories } = await categoriesServices.getCategories()

            const htmls = categories.map((category) => {
                return `
                    <option value="${category.id}">Bất động sản - ${category.name}</option>
                `
            })

            document.querySelector('.post__form__select').innerHTML = htmls.join('')
        } catch (error) {
            toast({
                title: 'Lỗi',
                message: 'Không thể tải danh mục bất động sản',
                type: 'error',
            })
        }
    },

    async init() {
        await middleware()
        defaultApp.init()
        new locationsDropdownApp(
            document.querySelector('#form__location'),
            this.postType === 'edit'
                ? (async () => {
                      try {
                          const { data: post } = await postsServices.getPostById(this.postId)

                          const [ward, district, province] = post.administrative_address.split(' - ')

                          return {
                              province,
                              district,
                              ward,
                          }
                      } catch (error) {
                          return {
                              province: '',
                              district: '',
                              ward: '',
                          }
                      }
                  })()
                : null
        ).init(this.handleSubmitLocation.bind(this))

        // if mode is edit, fill form data
        await this.fillFormData()
        await this.handleLoadCategory()
        this.handleValidator()
        this.handleEvent()
    },
}

postApp.init()
