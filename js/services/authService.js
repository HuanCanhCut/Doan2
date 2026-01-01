import * as fetchClient from '../utils/fetchClient.js'

export const login = async (email, password) => {
    try {
        const response = await fetchClient.post('auth/login', { email, password })

        return response.json()
    } catch (error) {
        throw error
    }
}

export const register = async (email, password) => {
    try {
        const response = await fetchClient.post('auth/register', { email, password })
        return response.json()
    } catch (error) {
        throw error
    }
}

export const logout = async () => {
    try {
        await fetchClient.post('auth/logout')
    } catch (error) {
        throw error
    }
}
