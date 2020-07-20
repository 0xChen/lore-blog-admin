module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'func-names': ['error', 'never'],
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-mixed-operators': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: {
        consistent: true
      },
      ObjectPattern: {
        consistent: true
      }
    }],
    'no-underscore-dangle': ['error', {
      allow: ['_this']
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'mock/**', // tape, common npm pattern
        'test/**', // tape, common npm pattern
        'tests/**', // also common npm pattern
        '**/__tests__/**', // jest pattern
        '**/__mocks__/**', // jest pattern
        'test.{js,jsx}', // repos with a single test file
        'test-*.{js,jsx}', // repos with multiple top-level test files
        '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
        '**/jest.config.js', // jest config
        '**/jest.setup.js', // jest setup
        '**/vue.config.js', // vue-cli config
        '**/webpack.config.js', // webpack config
        '**/webpack.config.*.js', // webpack config
        '**/webStorm.config.js'
      ],
      optionalDependencies: false
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
