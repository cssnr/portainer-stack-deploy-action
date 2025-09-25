import js from '@eslint/js'

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        settings: {
            env: {
                node: true,
                es2021: true,
            },
        },
        rules: {
            'no-undef': 'off',
            'no-extra-semi': 'off',
        },
    },
]
