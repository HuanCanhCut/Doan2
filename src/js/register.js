import Validator from './Validator'
import mockUser from '../mocks/users'
import middleware from './middleware'

const app = {
    handleEvent() {
        const redirectLogin = document.querySelector('.form__footer-toggle--login')

        redirectLogin.onclick = () => {
            window.parent.postMessage({ type: 'modal:toggle-modal', data: 'loginModal' }, '*')
        }
    },

    generateUuidV4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
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

                let nickname = email.split('@')[0]
                let nicknameCount = 0

                while (
                    users.some((user) => {
                        return (
                            user.nickname.startsWith(nickname) &&
                            (isNaN(Number(user.nickname.substring(nickname.length))) ||
                                Number(user.nickname.substring(nickname.length)) === 0)
                        )
                    })
                ) {
                    nicknameCount++
                    nickname = `${nickname}${nicknameCount}`
                }

                const newUser = {
                    ...mockUser,
                    id: lastUserId,
                    email,
                    password,
                    uuid: this.generateUuidV4(),
                    full_name: email.split('@')[0],
                    avatar: 'https://thichtrangtri.com/wp-content/uploads/2025/05/anh-meo-gian-cute-3.jpg',
                    nickname,
                }

                localStorage.setItem('users', JSON.stringify([...users, newUser]))
                localStorage.setItem('currentUser', JSON.stringify(newUser))

                window.parent.postMessage(
                    {
                        type: 'modal:auth-success',
                        data: { message: 'Đăng ký tài khoản thành công' },
                    },
                    '*',
                )
            },
        })
    },

    init() {
        middleware()
        this.handleEvent()
        this.handleRegister()
    },
}

app.init()
