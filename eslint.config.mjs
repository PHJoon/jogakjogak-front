import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import { globalIgnores } from 'eslint/config'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  globalIgnores(['node_modules/**', 'dist/**', 'build/**', '.next/**', 'out/**', 'coverage/**']),
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:import/recommended',
    'prettier'
  ),
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'type',
            // Imports of builtins are first
            'builtin',
            // Then sibling and parent imports. They can be mingled together
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'unknown'
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-unused-vars': 'off', // TS가 담당하도록 끔
      '@typescript-eslint/no-unused-vars': 'off', // next/typescript가 관리하는 경우 보통 off
    },
  },
];

export default eslintConfig;
