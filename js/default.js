import locationsDropdownApp from './locationsDropdown.js'
import toast from './toast.js'
import sidebarApp from './sidebar.js'
import { listenEvent, sendEvent } from './helpers/event.js'
import handleConvertPrice from './helpers/handleConvertPrice.js'
import mockPosts from '../mocks/posts.js'

const loginBtn = document.querySelector('.header__actions__button--login')
const registerBtn = document.querySelector('.header__actions__button--register')
const authBtn = document.querySelector('.header__actions__button--auth')
const modal = document.querySelector('#modal')
const overlay = document.querySelector('#overlay')
const userAvatar = document.querySelector('.header__actions__user img')
const logoutBtn = document.querySelector('.header__user__action--logout')
const headerSearchInput = document.querySelector('.header__search__input')

const defaultApp = {
    posts: JSON.parse(localStorage.getItem('posts')) || mockPosts || [],
    handleEvent() {
        window.addEventListener('message', (e) => {
            switch (e.data.type) {
                case 'modal:toggle-modal':
                    modal.setAttribute('src', `modal/${e.data.data}.html`)
                    break
                case 'modal:auth-success':
                    this.closeModal()

                    toast({
                        title: 'Thành công',
                        message: e.data.data.message,
                        type: 'success',
                    })

                    window.location.reload()

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

        userAvatar.onclick = () => {
            document.querySelector('.header__actions__user__wrapper').classList.toggle('active')
        }

        logoutBtn.onclick = () => {
            localStorage.removeItem('currentUser')

            window.location.reload()
        }

        headerSearchInput.oninput = (e) => {
            this.handleRenderHeaderSearchResult(e.target.value)
        }

        headerSearchInput.onfocus = (e) => {
            if (e.target.value.trim().length > 0) {
                document.querySelector('.header__search__result').classList.add('active')
            }
        }

        window.addEventListener('click', (e) => {
            // if click outside of user menu active, close it
            if (!e.target.closest('.header__actions__user__wrapper') && !e.target.closest('.header__actions__user')) {
                document.querySelector('.header__actions__user__wrapper').classList.remove('active')
            }

            // if click outside of header search, close it
            if (!e.target.closest('.header__search')) {
                document.querySelector('.header__search__result').classList.remove('active')
            }
        })

        listenEvent({
            eventName: 'modal:auth-open',
            handler: (e) => {
                this.openAuthModal(e.detail)
            },
        })
    },

    handleRenderHeaderSearchResult(value) {
        if (value.trim().length === 0) {
            document.querySelector('.header__search__result').classList.remove('active')
            document.querySelector('.header__search__result').innerHTML = ''
            return
        }

        // Create debounced search function only once
        if (!this.debouncedSearch) {
            this.debouncedSearch = (() => {
                let timeoutId
                return async (searchValue) => {
                    clearTimeout(timeoutId)
                    timeoutId = setTimeout(async () => {
                        const searchResult = this.posts.filter((post) => {
                            searchValue = searchValue.toLowerCase()

                            return (
                                post.title.toLowerCase().includes(searchValue) ||
                                post.address_bd.toLowerCase().normalize().includes(searchValue) ||
                                post.address.toLowerCase().includes(searchValue) ||
                                (post.address + ' ' + post.address_bd).toLowerCase().includes(searchValue)
                            )
                        })

                        if (searchResult.length > 0) {
                            document.querySelector('.header__search__result').classList.add('active')
                            document.querySelector('.header__search__result').innerHTML = searchResult
                                .slice(0, 5)
                                .map((post) => {
                                    return `
                                        <a class="header__search__result__item" href="details.html?post_id=1">
                                            <img
                                                src="${post.images[0]}"
                                                alt=""
                                            />
                                            <div class="header__search__result__item--info">
                                                <h4>${post.title}</h4>
                                                <p>
                                                    <span class="header__search__result__item--info__price">${handleConvertPrice(
                                                        post.detail.price
                                                    )}</span>
                                                    <span class="header__search__result__item--info__price__m2">${Number(
                                                        post.detail.price / post.detail.area / 1000000
                                                    ).toFixed(2)} tr/m²</span
                                                    ><span class="header__search__result__item--info__price__m2">${
                                                        post.detail.area
                                                    }m²</span>
                                                </p>
                                                <p>${post.address + ' - ' + post.address_bd}</p>
                                            </div>
                                        </a>
                                `
                                })
                                .join('')
                        }
                    }, 300)
                }
            })()
        }

        // Use the cached debounced function
        this.debouncedSearch(value)
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

            document.querySelectorAll('.header__user__action--profile').forEach((item) => {
                item.setAttribute('href', `user.html?nickname=${currentUser.nickname}`)
            })

            document.querySelectorAll('.header__user__action--favorite').forEach((item) => {
                item.setAttribute('href', `user.html?nickname=${currentUser.nickname}&active_tab=favorites`)
            })
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
        modal.setAttribute('src', `modal/${modalName}.html`)
        modal.classList.add('active')
        overlay.classList.add('active')
    },

    closeModal() {
        modal.classList.remove('active')
        overlay.classList.remove('active')
    },

    handleSubmitLocation(locations) {
        sendEvent({
            eventName: 'header:location-submit',
            detail: locations,
        })
    },

    init() {
        this.handleEvent()
        this.handleLoadUI()
        new locationsDropdownApp(document.querySelector('#header__location')).init(this.handleSubmitLocation.bind(this))
        sidebarApp.init()
    },
}

export default defaultApp
