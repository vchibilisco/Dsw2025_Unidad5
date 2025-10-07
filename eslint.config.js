import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      semi: ['error', 'always'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // regla para respetar la tabulación
      indent: ['error', 2, { SwitchCase: 1 }],
      // regla para usar comillas simples
      quotes: ['error', 'single', { avoidEscape: true }],
      // regla para el uso de punto y coma al final de las líneas
      'semi-style': ['error', 'last'],
      // regla para el uso de comas finales en objetos y arrays
      'comma-dangle': ['error', 'always-multiline'],
      // regla para el espacio antes y después de los corchetes en objetos y arrays
      'object-curly-spacing': ['error', 'always'],
      // regla para el espacio antes y después de los paréntesis en funciones
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      // regla para el uso de espacios en blanco
      'no-trailing-spaces': 'error',
      // regla para el uso de líneas en blanco
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
      ],
      // regla para el uso de espacios en operadores
      'space-infix-ops': 'error',
      // regla para el uso de espacios en declaraciones de bloques
      'block-spacing': ['error', 'always'],
      // regla para el uso de espacios en declaraciones de bloques
      'keyword-spacing': ['error', { before: true, after: true }],
      // regla para el uso de espacios en declaraciones de bloques
      'space-before-blocks': ['error', 'always'],
      // regla para agregar un espacio despues de las comas
      'comma-spacing': ['error', { before: false, after: true }],
      // regla para no tener más de un renglon vacío
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    },
  },
]);
