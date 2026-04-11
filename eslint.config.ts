import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,

    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },

    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/*.md',
    ],
  },
  {
    rules: {
      '@stylistic/max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
      }],
      'perfectionist/sort-imports': ['error', {
        type: 'alphabetical',
        order: 'asc',
        internalPattern: ['^@/.*'],
        newlinesBetween: 1,
        groups: [
          'vue-core',
          { newlinesBetween: 0 },
          'vue-ecosystem',
          'external',
          'internal-type',
          { newlinesBetween: 0 },
          'internal-constants',
          'internal-utils',
          'internal-db',
          { newlinesBetween: 0 },
          'internal-stores',
          { newlinesBetween: 0 },
          'internal-composables',
          'internal-ui',
          { newlinesBetween: 0 },
          'internal',
          'type-index',
          'type-sibling',
          'type-parent',
          ['parent', 'sibling', 'index'],
        ],
        customGroups: [
          { groupName: 'vue-core', elementNamePattern: '^vue$' },
          { groupName: 'vue-ecosystem', elementNamePattern: '^(vue-router|pinia|@vueuse/)' },
          { groupName: 'internal-type', elementNamePattern: '^@/', modifiers: ['type'] },
          { groupName: 'internal-constants', elementNamePattern: '^@/.*/constants' },
          { groupName: 'internal-utils', elementNamePattern: '^@/.*/utils' },
          { groupName: 'internal-db', elementNamePattern: '^@/db' },
          { groupName: 'internal-stores', elementNamePattern: '^@/stores' },
          { groupName: 'internal-composables', elementNamePattern: '^@/composables' },
          { groupName: 'internal-ui', elementNamePattern: '^@/shared/ui' },
        ],
      }],
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }],
    },
  },
)
