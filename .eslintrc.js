module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "airbnb",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "plugin:jest/recommended",
	"plugin:react/recommended",
	"plugin:cypress/recommended"
  ],
  "parser": "babel-eslint",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaFeatures": {
        "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "babel",
    "filenames",
    "import",
    "jest",
    "jsx-a11y",
    "react",
    "react-hooks"
  ],
  "rules": {
    "array-callback-return": "off",
    "arrow-body-style": "off",
    "consistent-return": "off",
    "func-names": ["error", "never"],
    "max-len": ["error", { "code": 185 }],
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "no-restricted-globals": "off",
    "no-restricted-syntax": "off",
    "import/no-unresolved": "off",
    "prefer-const": "off",
    "prefer-destructuring": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  },
  "overrides": [{
	"files": [ "*.spec.js" , "commands.js"],
	"rules": {
	  "jest/valid-expect": 0
	}
  }]
};
