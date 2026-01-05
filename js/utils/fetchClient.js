const baseURL = 'https://localhost:8080/api/'

let isRefreshing = false
let failedQueue = [{ resolve: () => {}, reject: () => {} }]

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(null)
        }
    })
    failedQueue = []
}

const refreshToken = async () => {
    try {
        await fetch(`${baseURL}auth/refresh`, {
            method: 'GET',
            credentials: 'include',
        })
        processQueue(null)
    } catch (error) {
        processQueue(error)
        throw error
    }
}

const getNewToken = async () => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
        })
    }
    isRefreshing = true
    try {
        await refreshToken()
        isRefreshing = false
        return
    } catch (error) {
        isRefreshing = false
        throw error
    }
}

const request = async (path, options = {}) => {
    const url = `${baseURL}${path}`
    const config = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    }

    try {
        const response = await fetch(url, config)

        // Check for 401 and token refresh requirement
        const shouldRenewToken =
            response.status === 401 && !options._retry && response.headers.get('x-refresh-token-required') === 'true'

        if (shouldRenewToken) {
            try {
                await getNewToken()
                // Retry the original request
                return await fetch(url, { ...config, _retry: true })
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                throw refreshError
            }
        }

        if (!response.ok) {
            const json = await response.json()

            throw json
        }

        return response
    } catch (error) {
        throw error
    }
}

export const get = async (path, options = {}) => {
    const response = await request(path, {
        ...options,
        method: 'GET',
    })
    return response
}

export const post = async (path, data = {}, options = {}) => {
    const response = await request(path, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
    })
    return response
}

export const put = async (path, data = {}, options = {}) => {
    const response = await request(path, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    })
    return response
}

export const patch = async (path, data = {}, options = {}) => {
    const response = await request(path, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    return response
}

export const del = async (path, options = {}) => {
    const response = await request(path, {
        ...options,
        method: 'DELETE',
    })
    return response
}

export default request
