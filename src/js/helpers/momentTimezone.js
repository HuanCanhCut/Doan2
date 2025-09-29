export const momentTimezone = (timestamp) => {
    const now = new Date()
    const targetTime = new Date(timestamp)

    // Tính chênh lệch thời gian (milliseconds)
    const diffMs = now - targetTime
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    // Nếu là thời gian trong tương lai
    if (diffSeconds < 0) {
        return 'vừa xong'
    }

    // Dưới 1 phút
    if (diffSeconds < 60) {
        return 'vừa xong'
    }

    // Dưới 1 giờ
    if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`
    }

    // Dưới 1 ngày
    if (diffHours < 24) {
        return `${diffHours} giờ trước`
    }

    // Dưới 1 tuần
    if (diffDays < 7) {
        return `${diffDays} ngày trước`
    }

    // Dưới 1 tháng
    if (diffWeeks < 4) {
        return `${diffWeeks} tuần trước`
    }

    // Dưới 1 năm
    if (diffMonths < 12) {
        return `${diffMonths} tháng trước`
    }

    // Từ 1 năm trở lên
    return `${diffYears} năm trước`
}
