import provincesDropdownApp from './locationsDropdown'
import toast from './toast'
import sidebarApp from './sidebar'
import { listenEvent } from './helpers/event'

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

                    this.handleLoadUI()

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
            this.openAuthModal('loginModal')
        })

        registerBtn.addEventListener('click', () => {
            this.openAuthModal('registerModal')
        })

        authBtn.addEventListener('click', () => {
            this.openAuthModal('loginModal')
        })

        overlay.addEventListener('click', () => {
            this.closeModal()
        })

        listenEvent({
            eventName: 'modal:auth-open',
            handler: (e) => {
                this.openAuthModal(e.detail)
            },
        })
    },

    // load ui after login/logout
    handleLoadUI() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        if (currentUser) {
            document.querySelector('.header__actions--post').classList.remove('col-hidden')
            document.querySelector('.header__actions--auth').classList.add('col-hidden')
            document.querySelector('.header__actions--auth[data-type="mobile"]').classList.remove('col-block')
            document.querySelector('.header__actions__user').classList.add('active')

            document.querySelector('.sidebar__user__info').classList.add('active')
            document.querySelector('.sidebar__auth').classList.remove('active')
        } else {
            document.querySelector('.header__actions--post').classList.add('col-hidden')
            document.querySelector('.header__actions--auth').classList.remove('col-hidden')
            document.querySelector('.header__actions--auth[data-type="mobile"]').classList.add('col-block')
            document.querySelector('.header__actions__user').classList.remove('active')

            document.querySelector('.sidebar__user__info').classList.remove('active')
            document.querySelector('.sidebar__auth').classList.add('active')
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
        this.handleLoadUI()
        provincesDropdownApp.init()
        sidebarApp.init()
    },
}

defaultApp.init()
