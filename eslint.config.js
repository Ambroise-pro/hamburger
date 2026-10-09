// Analyse statique orientée sécurité (exécutée en CI : .github/workflows/ci.yml).
const js = require('@eslint/js');
const globals = require('globals');
const security = require('eslint-plugin-security');
const noUnsanitized = require('eslint-plugin-no-unsanitized');

module.exports = [
  { ignores: ['node_modules/', 'public/vendor/', 'public/assets/'] },
  js.configs.recommended,
  security.configs.recommended,
  noUnsanitized.configs.recommended,
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser, firebase: 'readonly' }
    },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      // Les accès « obj[clé] » de l'appli portent sur des données internes : trop de faux positifs.
      'security/detect-object-injection': 'off'
    }
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { sourceType: 'module', globals: globals.node }
  },
  {
    files: ['*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node }
  }
];
