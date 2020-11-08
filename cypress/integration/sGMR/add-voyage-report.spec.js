const { getFutureDate } = require('../../support/utils');

describe('Add new voyage report', () => {
  let departureDateTime;
  let departurePort;
  let arrivalDateTime;
  let arrivalPort;
  let vessel;
  let people;
  let departDate;
  let departTime;

  before(() => {
    cy.registerUser();
  });

  beforeEach(() => {
    cy.login();

    cy.getPersonObj().then((personObj) => {
      people = personObj;
    });

    cy.getVesselObj().then((vesselObj) => {
      vessel = vesselObj;
    });

    departurePort = 'Port of Hong Kong';
    arrivalPort = 'Port of Felixstowe';
    departureDateTime = getFutureDate(1, 'DD/MM/YYYY HH:MM');
    departDate = departureDateTime.split(' ')[0];
    departTime = departureDateTime.split(' ')[1];
    arrivalDateTime = getFutureDate(2, 'DD/MM/YYYY HH:MM');

    cy.navigation('Notifications');
    cy.url().should('include', '/reports');
    cy.checkNotifications('Draft', 0);
    cy.get('.govuk-button--start').should('have.text', 'Start now').click();
  });

  it('Should submit report successfully', () => {
    const expectedReport = [
      {
        'Vessel': vessel.name,
        'Departure date': departDate,
        'Departure time': `${departTime}:00`,
        'Departure port': departurePort,
        'Arrival port': arrivalPort,
        'Submission reference': '',
      },
    ];
    cy.enterDepartureDetails(departureDateTime, departurePort);
    cy.saveAndContinue();
    cy.enterArrivalDetails(arrivalDateTime, arrivalPort);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterVesselInfo(vessel);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Add a new person to the Reports').click();
    cy.enterPeopleInfo(people);
    cy.get('.govuk-button').contains('Add to manifest').click();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterSkipperDetails();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Accept and submit report').click();
    cy.url().should('include', '/save-voyage/page-submitted');
    cy.get('.govuk-panel__title').should('have.text', 'Advance Voyage Notification Submitted');
    cy.navigation('Notifications');
    cy.checkNotifications('Submitted', 1);
    cy.contains('View existing notifications').click();
    cy.get('.govuk-tabs__list li')
      .within(() => {
        cy.get('#submitted').should('have.text', 'Submitted')
          .click();
        cy.wait(2000);
      });
    cy.contains('h2', 'Submitted').next().getTable().should((reportData) => {
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
    });
  });

  it('Should be able to cancel report', () => {
    const expectedReport = [
      {
        'Vessel': vessel.name,
        'Departure date': departDate,
        'Departure time': `${departTime}:00`,
        'Departure port': departurePort,
        'Arrival port': arrivalPort,
        'Submission reference': '',
      },
    ];
    cy.enterDepartureDetails(departureDateTime, departurePort);
    cy.saveAndContinue();
    cy.enterArrivalDetails(arrivalDateTime, arrivalPort);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterVesselInfo(vessel);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Add a new person to the Reports').click();
    cy.enterPeopleInfo(people);
    cy.get('.govuk-button').contains('Add to manifest').click();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterSkipperDetails();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Cancel voyage').click();
    cy.url().should('include', '/reports');
    cy.navigation('Notifications');
    cy.checkNotifications('Cancelled', 1);
    cy.contains('View existing notifications').click();
    cy.get('.govuk-tabs__list li')
      .within(() => {
        cy.get('#cancelled').should('have.text', 'Cancelled')
          .click();
        cy.wait(2000);
      });
    cy.contains('h2', 'Cancelled').next().getTable().should((reportData) => {
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
    });
  });

  it('Should be able to save report for later', () => {
    const expectedReport = [
      {
        'Vessel': vessel.name,
        'Departure date': departDate,
        'Departure time': `${departTime}:00`,
        'Departure port': departurePort,
        'Arrival port': arrivalPort,
        'Submission reference': '',
      },
    ];
    cy.enterDepartureDetails(departureDateTime, departurePort);
    cy.saveAndContinue();
    cy.enterArrivalDetails(arrivalDateTime, arrivalPort);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterVesselInfo(vessel);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Add a new person to the Reports').click();
    cy.enterPeopleInfo(people);
    cy.get('.govuk-button').contains('Add to manifest').click();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.enterSkipperDetails();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Exit without saving').click();
    cy.url().should('include', '/reports');
    cy.navigation('Notifications');
    cy.checkNotifications('Draft', 1);
    cy.contains('View existing notifications').click();
    cy.get('.govuk-tabs__list li')
      .within(() => {
        cy.get('#draft').should('have.text', 'Draft')
          .click();
        cy.wait(2000);
      });
    cy.contains('h2', 'Draft').next().getTable().should((reportData) => {
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
    });
  });

  after(() => {
    if (Cypress.env('envname') === 'local') {
      const query = `sh cypress/scripts/delete-reports.sh ${Cypress.env('dbName')}`;
      cy.exec(query);
    }
  });
});
