const handleConvertPrice = (amount) => {
    if (amount.length < 7) {
        return `${(Number(amount) / 1000).toLocaleString('vi-VN')} nghìn`
    } else if (amount.length >= 7 && amount.length <= 9) {
        return `${(Number(amount) / 1000000).toLocaleString('vi-VN')} triệu`
    } else {
        return `${(Number(amount) / 1000000000).toLocaleString('vi-VN')} tỷ`
    }
}

export default handleConvertPrice
