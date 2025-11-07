const handleConvertPrice = (amount) => {
    if (amount.length < 7) {
        return `${Number(amount) / 1000} nghìn`
    } else if (amount.length >= 7 && amount.length <= 9) {
        return `${Number(amount) / 1000000} triệu`
    } else {
        return `${Number(amount) / 1000000000} tỷ`
    }
}

export default handleConvertPrice
