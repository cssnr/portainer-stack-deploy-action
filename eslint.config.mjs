import js from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      env: {
        browser: true,
        es2021: true,
        jquery: true,
        webextensions: true,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-extra-semi': 'off',
    },
  },
]
