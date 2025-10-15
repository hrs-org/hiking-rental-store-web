import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import ngrx from '@ngrx/eslint-plugin/v9';

export default defineConfig([
  // Top-level ignore for all files
  {
    ignores: [
      'node_modules',
      'build',
      'dist',
      'coverage',
      '.angular',
      'node_modules/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.angular/**',
    ],
  },
  // Your TypeScript config
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...ngrx.configs.store,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      semi: 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
]);
