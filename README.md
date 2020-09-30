# sGMR Service

### Getting started

1 - Clone this repo
2 - Install package dependencies
```sh
npm install
```

### Build the application (dev mode)
```sh
npm run build-dev
```

### Running application
```sh
npm start
```

### Running tests
```sh
npm test
```

### Running linter
```sh
npm run lint -- <directory>
```

### Running End to End tests (cypress tests)
There are two ways to run cypress tests, using the cypress test runner or running cypress tests using the command line.
(You will need both sGMR FE and API services running before triggering Cypress)

#### Running Cypress Test Runner
```sh
npx cypress open
```

Once TestRunner launched, click on the interested spec inside folder cypress/integration/sGMR

#### Running Cypress tests using the command line

## Running all tests, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test -- --spec cypress/integration/sGMR/**/*
```

## Running a specific test
```sh
npm run cypress:test -- --spec cypress/integration/sGMR/register-user.spec.js
```

## Running specific test with chrome browser
```sh
npm run cypress:test -- --browser chrome --spec cypress/integration/sGMR/register-user.spec.js
```