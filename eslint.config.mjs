import globals from 'globals'

import pluginJs from '@eslint/js'

export default [
    { files: ['**/*.{js,mjs,cjs}'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    {
        rules: {
            'simple-import-sort/exports': 'warn',
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-undef-init': 'warn',
            eqeqeq: 'warn',
            'no-fallthrough': 'warn',
            'no-var': 'warn',
        },
        ignores: ['**/node_modules/', '**/dist/'],
    },
]
