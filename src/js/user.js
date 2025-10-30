import defaultApp from './default'

const postManagerTabs = document.querySelectorAll('.post__manager__tabs--button')

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

console.log(activeTab)

defaultApp.init()
