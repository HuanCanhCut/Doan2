// Hàm đọc số thành chữ tiếng Việt

const unitTexts = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
const scaleTexts = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ']

const readThreeDigits = (num, hasScale = false) => {
    const absNum = Math.abs(num)
    const hundred = Math.floor(absNum / 100)
    const remainder = absNum % 100
    const tens = Math.floor(remainder / 10)
    const units = remainder % 10

    let result = ''

    if (hundred > 0) {
        result += `${unitTexts[hundred]} trăm `
    } else if (hasScale && (tens > 0 || units > 0)) {
        result += 'không trăm '
    }

    if (tens > 1) {
        result += `${unitTexts[tens]} mươi `
    } else if (tens === 1) {
        result += 'mười '
    } else if (units > 0 && hasScale) {
        result += `lẻ `
    }

    if (tens > 1 && units === 1) {
        result += 'mốt '
    } else if (tens > 0 && units === 5) {
        result += 'lăm '
    } else if (units > 0) {
        result += unitTexts[units]
    }

    return result
}

const convertConcurrency = (num) => {
    let result = ''
    let index = 0

    const lastIndex = Math.floor(String(num).length / 3)

    while (num > 0) {
        const threeDigits = num % 1000
        const hasScale = index !== lastIndex

        if (threeDigits) {
            result = `${readThreeDigits(threeDigits, hasScale)} ${scaleTexts[index]} ${result}`
        }

        index++

        num = Math.floor(num / 1000)
    }

    return `${result[0].toUpperCase()}${result.substring(1)} đồng`
}

export const convertConcurrencyToNumber = (amount) => {
    const formatted = amount.toLocaleString('vi-VN')

    return formatted
}

export default convertConcurrency
