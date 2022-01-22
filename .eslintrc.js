module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        indent: ["warn", 4],
        "linebreak-style": ["warn", "unix"],
        quotes: ["warn", "double"],
        semi: ["warn", "always"],
        "no-unused-vars": [
            "warn",
            {
                vars: "all",
                args: "all",
            },
        ],
        "no-prototype-builtins": "off",
    },
};
