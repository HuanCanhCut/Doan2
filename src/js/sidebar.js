import { sendEvent } from './helpers/event'

const toggleSidebarBtn = document.querySelector('.header__toggle--sidebar')
const overlay = document.querySelector('#overlay')
const sidebar = document.querySelector('#sidebar')
const loginBtn = document.querySelector('.sidebar__auth--login')
const registerBtn = document.querySelector('.sidebar__auth--register')

const sidebarApp = {
    handleEvent() {
        toggleSidebarBtn.onclick = () => {
            overlay.classList.add('active')
            sidebar.classList.toggle('active')
        }

        overlay.onclick = () => {
            overlay.classList.remove('active')
            sidebar.classList.remove('active')
        }

        loginBtn.onclick = () => {
            sendEvent({ eventName: 'modal:auth-open', detail: 'loginModal' })

            sidebar.classList.remove('active')
        }

        registerBtn.onclick = () => {
            sendEvent({ eventName: 'modal:auth-open', detail: 'registerModal' })

            sidebar.classList.remove('active')
        }
    },
    init() {
        this.handleEvent()
    },
}

export default sidebarApp
