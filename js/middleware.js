import * as meServices from './services/meService.js'

const PRIVATE_ROUTES = ['/post.html', '/agent_contracts.html', '/customer_contracts.html']
const PUBLIC_ROUTES = ['/index.html', '/user.html', 'details.html', '/']
const AUTH_ROUTES = ['/loginModal.html', '/registerModal.html']
const ADMIN_ROUTES = ['/dashboard.html', '/admin_contracts.html', '/admin_reports.html', '/admin_manager_post.html']

const checkRoute = (routes) => {
    const pathname = window.location.pathname

    return routes.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)))
}

const middleware = async () => {
    let currentUser = null

    try {
        const { data: user } = await meServices.getCurrentUser()
        localStorage.setItem('currentUser', JSON.stringify(user))

        currentUser = user
    } catch (error) {
        localStorage.removeItem('currentUser')
    }

    const isPrivateRoute = checkRoute(PRIVATE_ROUTES)

    const isPublicRoute = checkRoute(PUBLIC_ROUTES)

    const isAuthRoute = checkRoute(AUTH_ROUTES)

    const isAdminRoute = checkRoute(ADMIN_ROUTES)

    // Nếu là public route: next
    if (isPublicRoute) {
        return
    }

    // Nếu có currentUser: auth route -> back | private route -> next | public route -> next
    if (currentUser) {
        if (isAuthRoute) {
            if (window.history.length > 1) {
                window.history.back()
            } else {
                window.location.href = '/'
            }
        }

        if (isAdminRoute) {
            if (currentUser.role !== 'admin') {
                window.location.href = '/'
            }

            return
        }

        // Nếu không có currentUser: private route -> login | public route -> next | auth route -> back
    } else {
        if (isPrivateRoute) {
            if (window.history.length > 1) {
                window.history.back()
            } else {
                window.location.href = '/modal/loginModal.html'
            }
        } else {
            return
        }
    }
}

export default middleware
