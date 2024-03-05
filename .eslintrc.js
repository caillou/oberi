const jsAndTsRules = {
  'react/function-component-definition': [
    // This is needed as we use the "prefer-arrow-functions" plugin.
    'error',
    {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    },
  ],
  'import/order': [
    // Made this rule more strict to avoid merge conflicts.
    'error',
    {
      groups: ['builtin', 'external', 'internal'],
      alphabetize: {
        order: 'asc', // Sort in ascending order. Options: ['ignore', 'asc', 'desc']
        caseInsensitive: true, // Ignore case. Options: [true, false]
      },
      'newlines-between': 'always',
      warnOnUnassignedImports: false,
    },
  ],
  'no-underscore-dangle': [
    'error',
    {
      allow: ['__typename'],
    },
  ],
  'import/prefer-default-export': 'off',
};

module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:tailwindcss/recommended', 'airbnb', 'next/core-web-vitals', 'prettier'],
      rules: { ...jsAndTsRules, 'react/require-default-props': 'off' },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:tailwindcss/recommended',
        'airbnb',
        'airbnb-typescript',
        'next/core-web-vitals',
        'prettier',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        ...jsAndTsRules,
        '@typescript-eslint/no-non-null-assertion': 'error',
        'react/require-default-props': 'off',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        'default-case': 'off',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
    {
      files: ['src/types/generated/*.d.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 0,
      },
    },
  ],
};
