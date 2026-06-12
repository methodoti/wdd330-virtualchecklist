import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': [1, { argsIgnorePattern: 'res|next|^err' }],
      'arrow-body-style': [2, 'as-needed'],
      'no-param-reassign': [2, { props: false }],
      'no-console': 1,
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
    },
  },
];
