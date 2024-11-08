module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-native/all',
    'google',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/**/*.js'],
    },
  ],
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-spacing': 'warn',
    'comma-spacing': 'off',
    'spaced-comment': 'off',
    'react/react-in-jsx-scope': 'off',
    'camelcase': 'off',
    'no-extra-boolean-cast': 'off',
    'linebreak-style': 'off',
    'func-call-spacing': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'operator-linebreak': 'off',
    'no-invalid-this': 'off',
    'semi': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'brace-style': ['off', 'off'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'multiline-const', next: '*' },
      { blankLine: 'always', prev: 'multiline-let', next: '*' },
      { blankLine: 'always', prev: 'multiline-var', next: '*' },
    ],
    'import/order': 'off',
    'no-underscore-dangle': 'off',
    'object-shorthand': 'off',
    'indent': 0,
    'react/display-name': 0,
    'react/no-unescaped-entities': 0,
    'require-jsdoc': 0,
    'react/jsx-key': 0,
    'react/prop-types': 0,
    'react/jsx-tag-spacing': [
      'warn',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'never',
        afterOpening: 'never',
        beforeClosing: 'never',
      },
    ],
    'array-bracket-newline': ['warn', 'consistent'],
    'array-bracket-spacing': ['warn', 'never'],
    'array-element-newline': ['warn', 'consistent'],
    'max-params': ['warn', 4],
    'jsx-quotes': ['warn', 'prefer-double'],
    'object-curly-spacing': ['warn', 'always'],
    'max-len': [
      'warn',
      {
        ignorePattern: '^import |^export | implements | className',
        code: 120,
        tabWidth: 2,
      },
    ],
    'arrow-spacing': 'warn',
    'block-spacing': 'warn',
    'function-call-argument-newline': ['warn', 'consistent'],
    '@typescript-eslint/func-call-spacing': 'warn',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'quote-props': ['warn', 'consistent'],
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'explicit',
      }
    ],
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
    'arrow-parens': ['warn', 'always'],
    'quotes': ['warn', 'single'],

    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-single-element-style-arrays': 'warn',
  },
};
