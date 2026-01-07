import * as fetchClient from '../utils/fetchClient.js'

export const getCurrentUser = async () => {
    try {
        const response = await fetchClient.get('users/me')

        return await response.json()
    } catch (error) {
        throw error
    }
}

export const getUserByNickname = async (nickname) => {
    try {
        const response = await fetchClient.get(`users/${nickname}`)

        return await response.json()
    } catch (error) {
        throw error
    }
}

export const updatedUser = async (data) => {
    try {
        const response = await fetchClient.put('users/me/update', data)
        return await response.json()
    } catch (error) {
        throw error
    }
}
