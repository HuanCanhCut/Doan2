import Validator from './Validator.js'
import middleware from './middleware.js'

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

                const users = JSON.parse(localStorage.getItem('users')) || []

                const userExist = users.find((user) => user.email === email && user.password === password)

                if (!userExist) {
                    document.querySelector('.error-message').innerText = 'Email hoặc mật khẩu không chính xác'
                    return
                }

                localStorage.setItem('currentUser', JSON.stringify(userExist))

                window.parent.postMessage(
                    {
                        type: 'modal:auth-success',
                        data: { message: 'Đăng nhập thành công' },
                    },
                    '*'
                )
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
