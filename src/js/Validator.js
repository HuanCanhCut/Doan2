import getParentElement from './helpers/getParentElement'

const Validator = (options) => {
    let formElement = document.querySelector(options.form)
    let selectorRules = {}

    if (formElement) {
        //? function invalid
        const invalid = (inputElement, rule) => {
            let errorElement = getParentElement(inputElement, options.formGroup).querySelector(options.errorSelector)
            let errorMessage

            let rules = selectorRules[rule.selector]
            for (let i = 0; i < rules.length; ++i) {
                errorMessage = rules[i](inputElement.value)
                if (errorMessage) {
                    break
                }
            }

            if (errorMessage) {
                errorElement.innerText = errorMessage
                getParentElement(inputElement, options.formGroup).classList.add('invalid')
            } else {
                errorElement.innerText = ''
                getParentElement(inputElement, options.formGroup).classList.remove('invalid')
            }

            //? input handled
            inputElement.oninput = () => {
                const errorMessage = document.querySelector('.error-message')

                if (errorMessage) {
                    errorMessage.innerText = ''
                }

                errorElement.innerText = ''
                getParentElement(inputElement, options.formGroup).classList.remove('invalid')
            }
            return !errorMessage
        }

        let arrayRules = options.rules
        //? handled submit
        formElement.onsubmit = async (e) => {
            e.preventDefault()

            let isFormValid = true

            for (let rule of arrayRules) {
                let inputElement = document.querySelector(rule.selector)
                let isValid = invalid(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            }

            if (isFormValid) {
                //? submit with javascript
                if (typeof options.submit === 'function') {
                    const enabledInputs = formElement.querySelectorAll('[name]')

                    const data = Array.from(enabledInputs).reduce((value, input) => {
                        value[input.name] = input.value
                        return value
                    }, {})

                    await options.submit(data)
                } else {
                    formElement.submit()
                }
            }
        }

        for (let rule of arrayRules) {
            //! Handle the case where there are many overlapping rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            let inputElement = document.querySelector(rule.selector)

            inputElement.onblur = () => {
                invalid(inputElement, rule)
            }
        }
    }
}

Validator.isRequired = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : errorMessage || 'Vui lòng nhập trường này!'
        },
    }
}

Validator.isEmail = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(value)
                ? undefined
                : errorMessage || 'Email không đúng định dạng!'
        },
    }
}
Validator.isPassword = (selector, min, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim().length >= min ? undefined : errorMessage || `Password phải có ít nhất ${min} ký tự!`
        },
    }
}

Validator.isConfirm = (selector, getConfirmValue, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() === getConfirmValue() ? undefined : errorMessage || 'Mật khẩu không khớp!'
        },
    }
}

Validator.isUrl = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g.test(
                value
            )
                ? undefined
                : errorMessage || 'URL không hợp lệ!'
        },
    }
}

Validator.isNumber = (selector, errorMessage) => {
    return {
        selector: selector,
        test: (value) => {
            if (value.trim() === '') {
                return undefined
            }

            return /^-?(\d{1,3}(\.\d{3})*|\d+)(\\,\d+)?$/.test(value.trim())
                ? undefined
                : errorMessage || 'Vui lòng nhập số!'
        },
    }
}

Validator.smallerThan = (selector, targetValue, errorMessage) => {
    return {
        selector: selector,
        test: (value) => {
            return value < targetValue ? undefined : errorMessage || 'Số phải nhỏ hơn ' + targetValue
        },
    }
}

export default Validator
