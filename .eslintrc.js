module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "prettier",
        "plugin:jsdoc/recommended"
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
        {
            files: ["frontend/**/*.{ts,vue,html}"],
            rules: {
                "indent": ["error", 2, { "SwitchCase": 1, "ObjectExpression": "first", "ArrayExpression": "first", "MemberExpression": "off", "ignoredNodes": ["ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"] }],
                "@typescript-eslint/indent": ["error", 2, { "SwitchCase": 1, "ObjectExpression": "first", "ArrayExpression": "first", "MemberExpression": "off" }],
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "vue", "jsdoc"],
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1, "ObjectExpression": "first", "ArrayExpression": "first", "MemberExpression": "off", "ignoredNodes": ["ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"] }],
        "no-duplicate-imports": "warn",
        "no-self-compare": "warn",
        "no-unmodified-loop-condition": "warn",
        "no-unreachable-loop": "error",
        "camelcase": ["warn", {"properties": "never"}],
        "curly": ["warn", "multi-line"],
        "default-case-last": "error",
        "dot-notation": "error",
        "func-style": ["error", "declaration"],
        "multiline-comment-style": "warn",
        "no-undef-init": "error",
        "no-var": "error",
        "block-spacing": "error",
        "@typescript-eslint/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "@typescript-eslint/indent": ["error", 4, { "SwitchCase": 1, "ObjectExpression": "first", "ArrayExpression": "first", "MemberExpression": "off", "ignoredNodes": ["ClassBody.body > PropertyDefinition[decorators.length > 0] > .key", "TSTypeParameterInstantiation"] }],
        "no-trailing-spaces": ["warn", {"skipBlankLines": true, "ignoreComments": true}],
        "@typescript-eslint/explicit-function-return-type": "error",
        semi: ["warn", "always"],
        quotes: ["error", "single"],
        "no-restricted-exports": ['error', { 'restrictDefaultExports': { 'direct': true } }],
        "jsdoc/require-jsdoc": ["warn", { "require": {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: false,
            MethodDefinition: false
        }, "contexts": [ "ExportDefaultDeclaration", "MethodDefinition[override!=true]" ] }],
        "jsdoc/require-param-type": 0,
        "jsdoc/require-returns-type": 0,
        "jsdoc/no-types": "error",
        "jsdoc/tag-lines": 0,
        "vue/comment-directive": "off"
    },
    settings: {
        jsdoc: {
            tagNamePreference: {
                augments: "extends",
                template: "typeParam",
            }
        }
    }
};
