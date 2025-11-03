// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        {
            name: 'reload',
            configureServer(server) {
                const { ws, watcher } = server
                watcher.on('change', (file) => {
                    if (file.endsWith('.html')) {
                        ws.send({
                            type: 'full-reload',
                        })
                    }
                })
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                default: 'default.html',
                post: 'post.html',
                details: 'details.html',
                user: 'user.html',
                adminManagerPost: 'admin_manager_post.html',
                loginModal: '/src/modal/loginModal.html',
                registerModal: '/src/modal/registerModal.html',
            },
        },
    },
    server: {
        allowedHosts: ['localhost', '127.0.0.1', 'doan.huancanhcut.click'],
    },
})
