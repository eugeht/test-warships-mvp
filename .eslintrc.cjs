/* eslint-env node */
require( '@rushstack/eslint-patch/modern-module-resolution' )

module.exports = {
  root    : true,
  plugins : [ 
    'promise',
    '@typescript-eslint',
  ],
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/base',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:promise/recommended',
  ],

  // Parser options for ts rules
  parser        : 'vue-eslint-parser',
  parserOptions : {
    parser      : '@typescript-eslint/parser',
    ecmaVersion : 'latest',
    project     : [
      './tsconfig.json',
      './tsconfig.app.json',
      './tsconfig.config.json',
    ],
  },

  overrides: [
    {
      files: [
        '*.ts',
        '*.cjs',
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      ],
      'extends': [ 'plugin:cypress/recommended' ],
    },
  ],

  //
  rules: {
    // logs
    'no-console'  : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger' : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // disallow duplicate module imports
    'no-duplicate-imports': [
      'error', {
        'includeExports': true,
      },
    ],

    // use === and !==
    'eqeqeq': 'error',

    // quotes
    'quotes': [
      'error', 'single', 
    ],

    // space in brackets
    'space-in-parens': [
      'error', 'always', 
    ],
    'array-bracket-spacing': [
      'error', 'always', 
    ],
    'object-curly-spacing': [
      'error', 'always', 
    ],
    'computed-property-spacing': [
      'error', 'always', 
    ],
    'template-curly-spacing': [
      'error', 'always', 
    ],

    // space
    // 'space-before-function-paren': [ 'error', {
    //   anonymous: 'always',
    //   named: 'never',
    //   asyncArrow: 'always'
    // } ],

    // 1tbs brace style
    'brace-style': [
      'error', 
      '1tbs', { 
        'allowSingleLine': true, 
      }, 
    ],

    // return in getters
    'getter-return': 'error',


    // 'no-undef': 'ignore',

    // name lengths
    // 'id-length': [
    //   'error', { 'min': 2 }, 
    // ],

    // Trailing newlines in non-empty files
    'eol-last': [
      'error', 'always', 
    ],

    // requires or disallows spaces between the function name and the opening parenthesis
    'func-call-spacing': [
      'error', 'never', 
    ],

    // enforce consistent brace style for all control statements
    'curly': [
      'error', 'all', 
    ],

    // disallow labeled statements
    'no-labels': 'error',

    // disallow unnecessary return await
    'no-return-await': 'error',

    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'error',

    // enforce linebreaks after opening and before closing array brackets
    'array-bracket-newline': [
      'error', {
        'multiline' : true,
        'minItems'  : 2,
      }, 
    ],
    
    // indent
    'indent': [
      'error', 2, 
    ],

    // disallows mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 'error',

    // comments
    // 'lines-around-comment': [ 
    //   'error', { 
    //     'beforeLineComment'          : true,
    //     'allowBlockStart'            : true,
    //     'allowObjectStart'           : true,
    //     'allowArrayStart'            : true,
    //     'allowClassStart'            : true,
    //     'ignorePattern'              : '(^ /|\\.$)',
    //     'applyDefaultIgnorePatterns' : false,
    //   }, 
    // ],

    // comment starts with space
    'spaced-comment': [
      'error', 'always', 
    ],

    // async
    'require-await': 'error',

    // template
    'prefer-template': 'error',

    // no empty lines on begin / end in blocks
    'padded-blocks': [
      'error', 'never', 
    ],

    // require or disallow trailing commas
    'comma-dangle': [
      'error', {
        'arrays'    : 'always-multiline',
        'objects'   : 'always-multiline', // never
        'imports'   : 'never', // never
        'exports'   : 'never', // never
        'functions' : 'never', // ignore
      }, 
    ],

    // enforce consistent comma style
    'comma-style': 'error',

    // disallow ternary operators when simpler alternatives exist
    'no-unneeded-ternary': 'error',

    // Async
    'promise/prefer-await-to-then': 'error', 

    // Async - promise
    'no-async-promise-executor'  : 'error',
    'no-await-in-loop'           : 'error',
    'no-promise-executor-return' : 'error',
    'max-nested-callbacks'       : [
      'error', 3, 
    ],
    'prefer-promise-reject-errors': 'error',

    // colon align
    'key-spacing': [
      'error', {
        'align': {
          'beforeColon' : true,
          'afterColon'  : true,
          'on'          : 'colon',
        },
      }, 
    ],

    // spacing
    'keyword-spacing': [ 
      'error', { 
        'before' : true,
        'after'  : true,
      },
    ],

    // This rule would disallow the use of number literals that immediately lose precision
    'no-loss-of-precision': 'error',

    // disallow else blocks after return statements in if statements
    'no-else-return': [
      'error', {
        'allowElseIf': false,
      },
    ],



    // Vue
    'vue/script-setup-uses-vars': 'error',



    // Typescript
    '@typescript-eslint/no-this-alias': [
      'error', {
        'allowDestructuring' : true,
        'allowedNames'       : [ 'vm' ],
      }, 
    ],

    // @TODO: You have used a rule which requires parserServices to be generated. 
    // You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.
    '@typescript-eslint/await-thenable'         : 'error',
    '@typescript-eslint/no-floating-promises'   : 'error',
    '@typescript-eslint/no-misused-promises'    : 'error',
    '@typescript-eslint/promise-function-async' : 'error',
  },
}
