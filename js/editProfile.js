import Validator from './Validator.js'
import * as meServices from './services/meService.js'
import toast from './toast.js'

const nicknameInput = document.querySelector('#nickname')
const profileImageInput = document.querySelector('#profile-image')

let { data: currentUser } = await meServices.getCurrentUser()

let avatar = null

// custom validator rules
Validator.isNickname = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            if (value.trim() === '') {
                return errorMessage || 'Nickname không được để trống!'
            }

            if (!/^[a-zA-Z0-9._]+$/.test(value.trim())) {
                return errorMessage || 'Nickname chỉ có thể bao gồm chữ cái, chữ số, dấu gạch dưới và dấu chấm.'
            }

            const existingNickname = JSON.parse(localStorage.getItem('users')).find(
                (user) => user.nickname === value.trim() && user.id !== currentUser?.id
            )

            console.log(JSON.parse(localStorage.getItem('users')), currentUser)

            if (existingNickname) {
                return errorMessage || 'Nickname đã tồn tại!'
            }

            return undefined
        },
    }
}

Validator.isPhoneNumber = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            const existingPhoneNumber = JSON.parse(localStorage.getItem('users')).find(
                (user) => user.phone === value.trim() && user.id !== currentUser?.id
            )

            if (existingPhoneNumber) {
                return errorMessage || 'Số điện thoại đã tồn tại!'
            }

            return /^0[0-9]{9}$/.test(value.trim()) ? undefined : errorMessage || 'Số điện thoại không hợp lệ!'
        },
    }
}

Validator({
    form: '#edit-profile-form',
    errorSelector: '.form-message',
    formGroup: '.form-group',
    rules: [
        Validator.isRequired('#nickname'),
        Validator.isNickname('#nickname'),
        Validator.isRequired('#full_name'),
        Validator.isRequired('#phone'),
        Validator.isPhoneNumber('#phone'),
    ],
    submit: async (data) => {
        const { nickname, full_name, phone } = data

        const updatedUser = {
            avatar_url: 'https://weart.vn/wp-content/uploads/2025/06/chu-meo-cute-voi-bieu-cam-ngo-ngac-to-mo.jpg',
            nickname,
            full_name,
            phone_number: phone,
        }

        try {
            const res = await meServices.updatedUser(updatedUser)

            currentUser = res.data

            window.parent.postMessage(
                { type: 'modal:toast-success', data: { message: 'Cập nhật hồ sơ thành công' } },
                '*'
            )

            window.parent.postMessage({ type: 'modal:close' }, '*')
            window.parent.postMessage({ type: 'user:reload-profile', data: updatedUser }, '*')
        } catch (error) {
            toast({
                title: 'Lỗi',
                message: error.message,
                type: 'error',
            })
        }
    },
})

profileImageInput.onchange = (e) => {
    if (avatar) {
        URL.revokeObjectURL(avatar.preview)
    }

    avatar = e.target.files[0]

    const preview = URL.createObjectURL(avatar)

    avatar.preview = preview

    document.querySelector('.profile__image--preview').src = preview
}

document.querySelector(
    '.nickname-link'
).textContent = `${window.location.origin}/user.html?nickname=${currentUser?.nickname}`

nicknameInput.oninput = (e) => {
    document.querySelector(
        '.nickname-link'
    ).textContent = `${window.location.origin}/user.html?nickname=${e.target.value}`
}
//Hàm fillFormValue dùng để đổ dữ liệu user hiện tại vào form
const fillFormValue = () => {
    nicknameInput.value = currentUser?.nickname
    document.querySelector('#full_name').value = currentUser?.full_name
    document.querySelector('#phone').value = currentUser?.phone_number
}

fillFormValue()

document.querySelector('.button-cancel').onclick = () => {
    window.parent.postMessage({ type: 'modal:close' }, '*')
}
