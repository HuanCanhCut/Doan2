const PRIVATE_ROUTES = ['/post', '/agent_contracts', '/customer_contracts']
const PUBLIC_ROUTES = ['/']
const AUTH_ROUTES = ['/loginModal', '/registerModal']
const ADMIN_ROUTES = ['/dashboard', '/admin_contracts', '/admin_reports']

const checkRoute = (routes) => {
    const pathname = window.location.pathname

    return routes.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)))
}

const middleware = () => {
    const currentUser = localStorage.getItem('currentUser')

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
            if (JSON.parse(currentUser).role !== 'admin') {
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
                window.location.href = '/loginModal'
            }
        } else {
            return
        }
    }
}

export default middleware
