import Validator from './Validator'
import mockUser from '../mocks/users'

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

                const users = JSON.parse(localStorage.getItem('users')) || []

                const hasUser = users.some((user) => user.email === email)

                if (hasUser) {
                    document.querySelector('.error-message').innerText = 'Email đã tồn tại'
                    return
                }

                const lastUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1

                localStorage.setItem(
                    'users',
                    JSON.stringify([...users, { ...mockUser, id: lastUserId, email, password }])
                )
                localStorage.setItem('currentUser', JSON.stringify({ ...mockUser, id: lastUserId, email, password }))

                window.parent.postMessage(
                    {
                        type: 'modal:auth-success',
                        data: { message: 'Đăng ký tài khoản thành công' },
                    },
                    '*'
                )
            },
        })
    },

    init() {
        this.handleEvent()
        this.handleRegister()
    },
}

app.init()
