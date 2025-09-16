const toggleSidebarBtn = document.querySelector('.header__toggle--sidebar')
const overlay = document.querySelector('#overlay')
const sidebar = document.querySelector('#sidebar')

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
    },
    init() {
        this.handleEvent()
    },
}

export default sidebarApp
