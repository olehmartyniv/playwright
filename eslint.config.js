import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/', 'playwright-report', 'test-results/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'prefer-const': 'error',
    },
  },
];
