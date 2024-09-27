import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginImport from "eslint-plugin-import";

export default [
    {files: ["**/*.{js,mjs,cjs,jsx}"]},
    {languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}},
    {languageOptions: {globals: globals.browser}},
    pluginJs.configs.recommended,
    pluginReactConfig,
    {
        plugins: {
            import: pluginImport,
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "no-useless-escape": "off",
            "no-console": "error",
            'import/order': [
                'warn',
                {
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index'
                    ],
                    'newlines-between': 'always',
                    'alphabetize': {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'pathGroups': [
                        {
                            pattern: '**/*.scss',
                            group: 'index',
                            position: 'after',
                        },
                    ],
                    'pathGroupsExcludedImportTypes': ['builtin'],
                },
            ]
        }
    }
];
