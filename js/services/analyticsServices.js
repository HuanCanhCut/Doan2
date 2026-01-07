import * as fetchClient from '../utils/fetchClient.js'

export const analyticsOverview = async (startDate, endDate) => {
    try {
        const response = await fetchClient.get(`analytics/overview?start_date=${startDate}&end_date=${endDate}`)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const getLocationStatsSorted = async (startDate, endDate) => {
    try {
        const response = await fetchClient.get(`analytics/posts/location?start_date=${startDate}&end_date=${endDate}`)
        return await response.json()
    } catch (error) {
        throw error
    }
}
