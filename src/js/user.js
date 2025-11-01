import defaultApp from './default'

const postManagerTabs = document.querySelectorAll('.post__manager__tabs--button')
const editProfileBtn = document.querySelector('.profile__info--edit')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#overlay')

let activeTab = 'approved'

postManagerTabs.forEach((tab) => {
    tab.onclick = () => {
        postManagerTabs.forEach((tab) => {
            tab.classList.remove('active')
        })

        tab.classList.add('active')

        activeTab = tab.dataset.type
    }
})

editProfileBtn.onclick = () => {
    modal.setAttribute('src', `src/modal/editProfile.html`)
    modal.classList.add('active')
    overlay.classList.add('active')
}

defaultApp.init()
