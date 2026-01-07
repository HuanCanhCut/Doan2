import * as fetchClient from '../utils/fetchClient.js'

export const getCategories = async () => {
    try {
        const response = await fetchClient.get(`categories`)

        return await response.json()
    } catch (error) {
        throw error
    }
}

export const addCategory = async (category) => {
    try {
        const response = await fetchClient.post('categories', category)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const updateCategory = async (category) => {
    try {
        const response = await fetchClient.put(`categories/${category.id}`, category)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const deleteCategory = async (id) => {
    try {
        await fetchClient.del(`categories/${id}`)
    } catch (error) {
        throw error
    }
}
