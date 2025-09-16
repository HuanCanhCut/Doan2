import provincesDropdownApp from './locationsDropdown'
import toast from './toast'
import sidebarApp from './sidebar'

const loginBtn = document.querySelector('.header__actions__button--login')
const registerBtn = document.querySelector('.header__actions__button--register')
const authBtn = document.querySelector('.header__actions__button--auth')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#overlay')

const defaultApp = {
    handleEvent() {
        window.addEventListener('message', (e) => {
            switch (e.data.type) {
                case 'modal:toggle-modal':
                    modal.setAttribute('src', `src/modal/${e.data.data}.html`)
                    break
                case 'modal:auth-success':
                    this.closeModal()

                    toast({
                        title: 'Thành công',
                        message: e.data.data.message,
                        type: 'success',
                    })

                    this.handleLoadHeader()

                    break
                case 'modal:toast-success':
                    toast({
                        title: 'Thành công',
                        message: e.data.data.message,
                        type: 'success',
                    })
                    break
                case 'modal:close':
                    this.closeModal()
                    break

                case 'modal:toast':
                    toast({
                        title: 'Thông báo',
                        message: e.data.detail,
                        type: 'info',
                    })
                    break
                default:
                    break
            }
        })

        loginBtn.addEventListener('click', () => {
            this.openAuthModal('login_modal')
        })

        registerBtn.addEventListener('click', () => {
            this.openAuthModal('register_modal')
        })

        authBtn.addEventListener('click', () => {
            this.openAuthModal('login_modal')
        })

        overlay.addEventListener('click', () => {
            this.closeModal()
        })
    },

    handleLoadHeader() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        if (currentUser) {
            document.querySelector('.header__actions--post').classList.remove('col-hidden')
            document.querySelector('.header__actions--auth').classList.add('col-hidden')
        } else {
            document.querySelector('.header__actions--post').classList.add('col-hidden')
            document.querySelector('.header__actions--auth').classList.remove('col-hidden')
        }
    },

    openAuthModal(modalName) {
        modal.setAttribute('src', `src/modal/${modalName}.html`)
        modal.classList.add('active')
        overlay.classList.add('active')
    },

    closeModal() {
        modal.classList.remove('active')
        overlay.classList.remove('active')
    },

    init() {
        this.handleEvent()
        this.handleLoadHeader()
        provincesDropdownApp.init()
        sidebarApp.init()
    },
}

defaultApp.init()
