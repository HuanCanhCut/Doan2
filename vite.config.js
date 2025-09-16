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
                login_modal: '/src/modal/login_modal.html',
                register_modal: '/src/modal/register_modal.html',
            },
        },
    },
    server: {
        allowedHosts: ['localhost', '127.0.0.1', 'doan.huancanhcut.click'],
    },
})
