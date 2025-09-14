const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const app = {
    handleEvent() {
        // handle redirect to register modal
        const redirectRegister = $('.form__footer-toggle--register')

        redirectRegister.onclick = () => {
            window.parent.postMessage({ type: 'modal:toggle-modal', data: 'register_modal' }, '*')
        }
    },

    init() {
        this.handleEvent()
    },
}

app.init()
