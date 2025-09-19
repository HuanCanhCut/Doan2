import Validator from './Validator'
import defaultApp from './default'
import getParentElement from './helpers/getParentElement'
import locationsDropdownApp from './locationsDropdown'

const categoryBtnsOption = document.querySelectorAll('.post__form__radio')
const roleBtnsOption = document.querySelectorAll('.post__form__role')

const postApp = {
    locations: null,
    categoryType: 'sell', // sell or rent
    roleType: 'seller', // seller or agent

    handleValidator() {
        Validator({
            form: '#post__form',
            errorSelector: '.form-message',
            formGroup: '.form-group',
            rules: [
                Validator.isRequired('#type'),
                Validator.isRequired('#bedrooms'),
                Validator.isRequired('#bathrooms'),
                Validator.isRequired('#legal-documents'),
                Validator.isRequired('#area'),
                Validator.isRequired('#rent-price'),
                Validator.isRequired('#title'),
                Validator.isRequired('#description'),
            ],
            submit: async (data) => {
                //
            },
        })
    },

    handleSubmitLocation(locations) {
        this.locations = locations
        const addressBd = document.querySelector('#address-bd')

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
