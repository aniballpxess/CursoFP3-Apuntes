// eslint.config.mjs

import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';

/**
 * ESLint Flat Config for vanilla JS browser projects
 * - Uses ES modules (import/export)
 * - Integrates recommended rules from ESLint, import, and jsdoc
 * - Delegates all formatting to Prettier using your .prettierrc
 * - Disables formatting-related ESLint rules that conflict with Prettier
 */

const defaultConfig = [
  jsdoc.configs['flat/recommended'], // PENDING FINISH

  {
    files: ['**/*.js'],

    ignores: ['node_modules'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      import: pluginImport,
      prettier: prettier,
      jsdoc: jsdoc,
    },

    rules: {
      // Recommendations
      ...js.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': 'warn',

      // overrides
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
    },
  },
];

export default defaultConfig;
