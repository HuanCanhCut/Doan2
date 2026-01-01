import Validator from './Validator.js'
import middleware from './middleware.js'
import * as authService from './services/authService.js'

const app = {
    handleEvent() {
        const redirectLogin = document.querySelector('.form__footer-toggle--login')

        redirectLogin.onclick = () => {
            window.parent.postMessage({ type: 'modal:toggle-modal', data: 'loginModal' }, '*')
        }
    },

    handleRegister() {
        Validator({
            form: '#register-form',
            errorSelector: '.form-message',
            formGroup: '.form-group',
            rules: [
                Validator.isRequired('#email'),
                Validator.isEmail('#email'),
                Validator.isRequired('#password'),
                Validator.isPassword('#password', 6),
                Validator.isRequired('#confirmPassword'),
                Validator.isConfirm('#password', () => {
                    return document.getElementById('password').value
                }),
            ],
            submit: async (data) => {
                const { email, password } = data

                try {
                    const { data: newUser } = await authService.register(email, password)

                    localStorage.setItem('currentUser', JSON.stringify(newUser))

                    window.parent.postMessage(
                        {
                            type: 'modal:auth-success',
                            data: { message: 'Đăng ký tài khoản thành công' },
                        },
                        '*'
                    )
                } catch (error) {
                    document.querySelector('.error-message').innerText = error.message
                }
            },
        })
    },

    async init() {
        await middleware()
        this.handleEvent()
        this.handleRegister()
    },
}

app.init()
