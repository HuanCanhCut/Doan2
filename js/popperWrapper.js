export const handleSetPosition = (element) => {
    const clientRect = element.getBoundingClientRect()

    if (clientRect.right > window.innerWidth) {
        element.style.position = 'fixed'
        element.style.top = clientRect.top + 'px'
        element.style.left = `${window.innerWidth - element.offsetWidth}px`
    }
}
;(() => {
    const popperWrappers = document.querySelectorAll('.popper--wrapper')

    window.addEventListener('resize', () => {
        popperWrappers.forEach((popperWrapper) => {
            handleSetPosition(popperWrapper)
        })
    })
})()
