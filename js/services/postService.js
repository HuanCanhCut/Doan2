import * as fetchClient from '../utils/fetchClient.js'

export const getPosts = async ({ params = {} } = {}) => {
    try {
        const queryParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v))
            } else if (value !== undefined && value !== null) {
                queryParams.append(key, value)
            }
        })

        const queryString = queryParams.toString()

        const url = `posts?${queryString}`

        const response = await fetchClient.get(url)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const likePost = async (postId) => {
    try {
        const response = await fetchClient.post(`posts/${postId}/like`)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const unlikePost = async (postId) => {
    try {
        const response = await fetchClient.del(`posts/${postId}/unlike`)
        return response
    } catch (error) {
        throw error
    }
}

export const getPostById = async (postId) => {
    try {
        const response = await fetchClient.get(`posts/${postId}`)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const createPost = async (data) => {
    try {
        const response = await fetchClient.post(`posts`, data)
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const updatePost = async (postId, data) => {
    try {
        const response = await fetchClient.put(`posts/${postId}/update`, data)
        return await response.json()
    } catch (error) {
        throw error
    }
}
