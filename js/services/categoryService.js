import * as fetchClient from '../utils/fetchClient.js'

export const getCategories = async () => {
    try {
        const response = await fetchClient.get('categories')

        return await response.json()
    } catch (error) {
        throw error
    }
}
