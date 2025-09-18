import Validator from './Validator'
import defaultApp from './default'

const postApp = {
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

    init() {
        defaultApp.init()
        this.handleValidator()
    },
}

postApp.init()
