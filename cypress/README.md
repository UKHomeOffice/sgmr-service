# Cypress E2E Tests

### Pre-requiste
It is assumed that both sgmr UI and API services are running before start executing the tests
UI & Server details are stored in cypress.env.json (It needs to be changed in case different from default)

### How to Run Test with Cypress TestRunner
install Cypress by executing the following command
```sh
npm install cypress
```

launch Test runner by executing following command
```sh
npx cypress open
```
once TestRunner launched, click on the interested spec inside folder cypress/integration/sGMR

### How to Run Test from Commandline
Execute the following command to run all the tests, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test -- --spec cypress/integration/sGMR/**/*
```

Execute specific test
```sh
npm run cypress:test -- --spec cypress/integration/sGMR/register-user.spec.js
```

Execute specific test with chrome browser
```sh
npm run cypress:test -- --browser chrome --spec cypress/integration/sGMR/register-user.spec.js
```