import * as fetchClient from '../utils/fetchClient.js'

export const getPostsAnalyticsOverview = async () => {
    try {
        const response = await fetchClient.get('analytics/posts/overview')
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const getPostsManager = async ({ params = {} } = {}) => {
    try {
        const queryParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v))
            } else if (value !== undefined && value !== null) {
                if (value !== 'all' && value) {
                    queryParams.append(key, value)
                }
            }
        })

        const queryString = queryParams.toString()

        const url = `manager/posts?${queryString}`

        const response = await fetchClient.get(url)
        return await response.json()
    } catch (error) {
        throw error
    }
}
