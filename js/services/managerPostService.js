import * as fetchClient from '../utils/fetchClient.js'

export const modifyPostStatus = async (postId, type = 'approve') => {
    try {
        await fetchClient.patch(`manager/posts/${postId}/${type}`)
    } catch (error) {
        throw error
    }
}

export const deletePost = async (postId) => {
    try {
        await fetchClient.delete(`manager/posts/${postId}`)
    } catch (error) {
        throw error
    }
}
