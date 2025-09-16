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
            },
        },
    },
})
