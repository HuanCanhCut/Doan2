import * as fetchClient from '../utils/fetchClient.js'

export const login = async (email, password) => {
    try {
        const response = await fetchClient.post('/api/auth/login', { email, password })

        return response.json()
    } catch (error) {
        throw error
    }
}

export const register = async (email, password) => {
    try {
        const response = await fetchClient.post('/api/auth/register', { email, password })
        return response.json()
    } catch (error) {
        throw error
    }
}
