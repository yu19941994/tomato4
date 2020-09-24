
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "prettier/prettier": "off",
    "indent": ["error", 2, {
      "SwitchCase" : 1,
      "ignoredNodes": ["TemplateLiteral"]
    }],
    "semi": ["error", "never"],
    "no-multiple-empty-lines": [2, { "max": 2, "maxEOF": 1 }],
    "no-mixed-operators": 0,
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-case-declarations": "off",
    "no-unused-vars": [
      "warn",
      {
        "args": "none"
      }
    ],
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "space-before-function-paren": "warn",
    "prefer-promise-reject-errors": "off",
    "max-len": [
      "warn",
      {
        "code": 140,
        "tabWidth": 2,
        "ignoreTemplateLiterals": true,
        "ignoreStrings": true,
        "ignoreUrls": true,
        "ignoreComments": true
      }
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
}
