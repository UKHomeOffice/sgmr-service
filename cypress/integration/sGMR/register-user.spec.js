import { randomEmail } from '../../support/utils';

describe('User Registration', () => {
  let authCode;
  let user;
  let host;
  let apiServer;

  before(() => {
    cy.task('newUser').then((object) => {
      user = object;
    });
    host = Cypress.env('host');
    apiServer = Cypress.env('api_server');
  });

  it('Successful Registration', () => {
    cy.server();
    cy.route('POST', `${apiServer}/registration`).as('registration');

    cy.visit(`${host}/register`);

    cy.enterUserInfo(user);

    cy.get('.govuk-button').click();
    cy.url().should('include', '/verify?source=registration');

    cy.wait('@registration').should((xhr) => {
      expect(xhr.status).to.eq(200);
      authCode = xhr.responseBody.twoFactorToken;
      cy.get('input[name="twoFactorToken"]').type(authCode);
      cy.get('.govuk-button').click();
      cy.url().should('include', '/sign-in?source=registration');
    });
  });

  it('Failure Registration - Submit without any information', () => {
    let errors = ['You must enter your first name', 'You must enter your last name',
      'You must enter a valid phone number', 'You must enter a valid email address', 'You must enter a password'];

    cy.visit(`${host}/register`);
    cy.get('.govuk-button').click();

    cy.get('.govuk-error-message').each((error, index) => {
      cy.wrap(error).should('contain.text', errors[index]);
    });
    cy.url().should('not.include', '/sign-in?source=registration');
  });

  it('Duplicate Registration - Entering the exiting User information for registration', () => {
    cy.server();
    cy.route('POST', `${apiServer}/registration`).as('registration');

    cy.visit(`${host}/register`);

    cy.enterUserInfo(user);

    cy.get('.govuk-button').click();
    cy.get('.govuk-error-message').should('contain.text', 'User already registered');
  });

  it('Failure Registration - Entering Invalid Authentication code', () => {
    let mail = randomEmail();
    cy.server();
    cy.route('POST', `${apiServer}/registration`).as('registration');

    cy.visit(`${host}/register`);

    cy.enterUserInfo(user);
    cy.get('#email input[type="text"]').clear().type(mail);
    cy.get('#confirmEmail input[type="text"]').clear().type(mail);

    cy.get('.govuk-button').click();
    cy.get('input[name="twoFactorToken"]').type('1234');
    cy.get('.govuk-button').click();
    cy.get('.govuk-error-message').should('contain.text', 'Code is invalid');
    cy.url().should('not.include', '/sign-in?source=registration');
  });
});
