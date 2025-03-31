import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
// import checkFile from 'eslint-plugin-check-file';
// import reactHooks from 'eslint-plugin-react-hooks';
import reactCompiler from 'eslint-plugin-react-compiler';

//  { ignores: ['dist'] },
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
  reactCompiler.configs.recommended,
  {
    // in main config for TSX/JSX source files
    plugins: {
      // 'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // ...reactHooks.configs.recommended.rules,
    },
  },
  // {
  //   files: ['packages/**/*'],
  //   plugins: {
  //     'check-file': checkFile,
  //   },
  //   rules: {
  //     'check-file/no-index': 'error',

  //     // 'check-file/folder-match-with-fex': [
  //     //   'error',
  //     //   {
  //     //     '*.test.{js,jsx,ts,tsx}': '**/__tests__/',
  //     //     '*.styled.{jsx,tsx}': '**/pages/',
  //     //   },
  //     // ],
  //     // 'check-file/filename-naming-convention': [
  //     //   'error',
  //     //   {
  //     //     '**/src/**/*.{jsx,tsx}': 'CAMEL_CASE',
  //     //     '**/src/**/*.{js,ts}': 'KEBAB_CASE',
  //     //   },
  //     // ],
  //     'check-file/folder-naming-convention': [
  //       'error',
  //       {
  //         '**/src/**/': 'NEXT_JS_APP_ROUTER_CASE',
  //         // 'mocks/*/': 'KEBAB_CASE',
  //       },
  //     ],
  //   },
  // },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },
];
