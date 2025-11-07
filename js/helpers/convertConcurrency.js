// Hàm đọc số thành chữ tiếng Việt
const convertConcurrency = (num) => {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
    const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ']

    if (num === 0) return 'không đồng'
    if (num < 0) return 'âm ' + convertConcurrency(-num)

    let result = ''
    let scaleIndex = 0

    while (num > 0) {
        const chunk = num % 1000
        if (chunk !== 0) {
            const chunkWords = convertChunk(chunk)
            if (scaleIndex > 0) {
                result = chunkWords + ' ' + scales[scaleIndex] + ' ' + result
            } else {
                result = chunkWords + ' ' + result
            }
        }
        num = Math.floor(num / 1000)
        scaleIndex++
    }

    return result.trim() + ' đồng'

    function convertChunk(n) {
        let words = ''
        const hundreds = Math.floor(n / 100)
        const remainder = n % 100
        const tensDigit = Math.floor(remainder / 10)
        const onesDigit = remainder % 10

        // Xử lý hàng trăm
        if (hundreds > 0) {
            words += ones[hundreds] + ' trăm'
        }

        // Xử lý phần còn lại (< 100)
        if (remainder > 0) {
            if (hundreds > 0) words += ' '

            if (remainder < 10) {
                // Chỉ thêm "lẻ" nếu có hàng trăm và số < 10
                if (hundreds > 0) {
                    words += 'lẻ ' + ones[remainder]
                } else {
                    words += ones[remainder]
                }
            } else if (remainder >= 10 && remainder < 20) {
                // 10-19: mười, mười một, mười hai...
                if (remainder === 10) {
                    words += 'mười'
                } else {
                    words += 'mười ' + ones[onesDigit]
                }
            } else {
                // 20-99: hai mươi, ba mươi...
                if (onesDigit === 5) {
                    words += ones[tensDigit] + ' mươi lăm'
                } else if (onesDigit === 0) {
                    words += ones[tensDigit] + ' mươi'
                } else {
                    words += ones[tensDigit] + ' mươi ' + ones[onesDigit]
                }
            }
        }

        return words.trim()
    }
}

export const convertConcurrencyToNumber = (amount) => {
    const formatted = amount.toLocaleString('vi-VN')

    return formatted
}

export default convertConcurrency
