import * as fetchClient from '../utils/fetchClient.js'

export const getAllUsers = async (page, perPage) => {
    try {
        const response = await fetchClient.get(`users?page=${page}&per_page=${perPage}`)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (userId) => {
    try {
        return await fetchClient.del(`analytics/users/${userId}`)
    } catch (error) {
        throw error
    }
}
