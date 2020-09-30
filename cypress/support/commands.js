Cypress.Commands.add('enterUserInfo', (user) => {
  cy.get('#firstName [type="text"]').clear().type(user.firstName);
  cy.get('#lastName [type="text"]').clear().type(user.lastName);
  cy.get('input[name="mobileNumber"][type="text"]').clear().type(user.mobileNumber);
  cy.get('#email input[type="text"]').clear().type(user.email);
  cy.get('#confirmEmail input[type="text"]').clear().type(user.email);
  cy.get('#password input[type="password"]').clear().type(user.password);
  cy.get('#confirmPassword input[type="password"]').clear().type(user.password);
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/sign-in');
  cy.get('#email input').type(email);
  cy.get('#password input ').type(password);

  cy.server();
  cy.route('POST', `${Cypress.env('api_server')}/login`).as('login');

  cy.get('.govuk-button').click();
  cy.url().should('include', '/verify?source=reports');

  cy.wait('@login').should((xhr) => {
    expect(xhr.status).to.eq(200);
    let authCode = xhr.responseBody.twoFactorToken;
    cy.get('input[name="twoFactorToken"]').type(authCode);
    cy.get('.govuk-button').click();
  });
  cy.url().should('include', '/reports');
  cy.get('.govuk-button--start').should('have.text', 'Start now');
});
