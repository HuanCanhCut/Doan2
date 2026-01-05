import * as fetchClient from '../utils/fetchClient.js'

export const getCurrentUser = async () => {
    try {
        const response = await fetchClient.get('users/me')

        return await response.json()
    } catch (error) {
        throw error
    }
}
