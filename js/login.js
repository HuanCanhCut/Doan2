import Validator from './Validator.js'
import middleware from './middleware.js'
import * as authService from './services/authService.js'

const app = {
    handleEvent() {
        // handle redirect to register modal
        const redirectRegister = document.querySelector('.form__footer-toggle--register')

        redirectRegister.onclick = () => {
            window.parent.postMessage({ type: 'modal:toggle-modal', data: 'registerModal' }, '*')
        }
    },

    handleLogin() {
        Validator({
            form: '#login-form',
            errorSelector: '.form-message',
            formGroup: '.form-group',
            rules: [
                Validator.isRequired('#email'),
                Validator.isEmail('#email'),
                Validator.isRequired('#password'),
                Validator.isPassword('#password', 6),
            ],
            submit: async (data) => {
                const { email, password } = data

                try {
                    const response = await authService.login(email, password)

                    localStorage.setItem('currentUser', JSON.stringify(response))

                    window.parent.postMessage(
                        {
                            type: 'modal:auth-success',
                            data: { message: 'Đăng nhập thành công' },
                        },
                        '*'
                    )
                } catch (error) {
                    document.querySelector('.error-message').innerText = error.message
                }
            },
        })
    },

    init() {
        middleware()
        this.handleEvent()
        this.handleLogin()
    },
}

app.init()
