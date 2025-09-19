const getParentElement = (element, selector) => {
    if (element.matches(selector)) {
        return element
    }

    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

export default getParentElement
