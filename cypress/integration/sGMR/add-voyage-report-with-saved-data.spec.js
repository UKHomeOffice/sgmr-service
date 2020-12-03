const { getFutureDate } = require('../../support/utils');

describe('Add report with saved data', () => {
  let departureDateTime;
  let departurePort;
  let arrivalDateTime;
  let arrivalPort;
  let vessel;
  let persons = [];
  let departDate;
  let departTime;
  const numberOfPersons = 3;

  before(() => {
    cy.registerUser();
    cy.login();
    cy.navigation('People');

    for (let i = 0; i < numberOfPersons; i += 1) {
      cy.getPersonObj().then((personObj) => {
        persons[i] = personObj;
        cy.addPeople(persons[i]);
      });
    }

    cy.navigation('Vessels');

    cy.getVesselObj().then((vesselObj) => {
      vessel = vesselObj;
      cy.addVessel(vessel);
    });
  });

  beforeEach(() => {
    departurePort = 'Dover';
    arrivalPort = 'Felixstowe';
    departureDateTime = getFutureDate(1, 'DD/MM/YYYY HH:MM');
    departDate = departureDateTime.split(' ')[0];
    departTime = departureDateTime.split(' ')[1];
    arrivalDateTime = getFutureDate(2, 'DD/MM/YYYY HH:MM');

    cy.login();
    cy.injectAxe();
    cy.url().should('include', '/reports');
    cy.checkReports('Draft', 0);
    cy.checkAccessibility();
    cy.get('.govuk-button--start').should('have.text', 'Start now').click();
  });

  it('Should be able to Cancel a submitted report using Saved People & Vessel', () => {
    const expectedReport = [
      {
        'Vessel': vessel.name,
        'Departure date': departDate,
        'Departure time': `${departTime}:00`,
        'Departure port': 'DVR',
        'Arrival port': 'FXT',
        'Submission reference': '',
      },
    ];
    cy.enterDepartureDetails(departureDateTime, departurePort);
    cy.saveAndContinue();
    cy.enterArrivalDetails(arrivalDateTime, arrivalPort);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.selectCheckbox(vessel.name);
    cy.contains('Add to report').click();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.wait(1000);
    cy.selectCheckbox(persons[0].lastName);
    cy.contains('Add to report and continue').click();
    cy.assertPeopleTable((reportData) => {
      expect(reportData).to.have.length(1);
    });
    cy.saveAndContinueOnPeopleManifest(false);
    cy.checkNoErrors();
    cy.enterSkipperDetails();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Accept and submit report').click();
    cy.url().should('include', '/save-voyage/page-submitted');
    cy.get('.govuk-panel__title').should('have.text', 'Pleasure Craft Report Submitted');
    cy.navigation('Reports');
    cy.checkReports('Submitted', 1);
    cy.contains('View existing reports').click();
    cy.get('.govuk-tabs__list li')
      .within(() => {
        cy.get('#submitted').should('have.text', 'Submitted')
          .click();
      });
    cy.contains('h2', 'Submitted').next().getTable().then((reportData) => {
      cy.wait(2000);
      expect(reportData).to.not.be.empty;
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
      cy.get('.govuk-table td a').contains(vessel.name).click();
      cy.contains('Cancel voyage').click();
      cy.contains('View existing reports').click();
      cy.get('.govuk-tabs__list li')
        .within(() => {
          cy.get('#cancelled').should('have.text', 'Cancelled')
            .click();
        });
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
    });
  });

  it('Should be able to submit a report with more than one passenger', () => {
    const expectedReport = [
      {
        'Vessel': vessel.name,
        'Departure date': departDate,
        'Departure time': `${departTime}:00`,
        'Departure port': 'DVR',
        'Arrival port': 'FXT',
        'Submission reference': '',
      },
    ];
    cy.enterDepartureDetails(departureDateTime, departurePort);
    cy.saveAndContinue();
    cy.enterArrivalDetails(arrivalDateTime, arrivalPort);
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.selectCheckbox(vessel.name);
    cy.contains('Add to report').click();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.wait(1000);
    for (let i = 0; i < numberOfPersons; i += 1) {
      cy.selectCheckbox(persons[i].lastName);
    }
    cy.contains('Add to report and continue').click();
    cy.assertPeopleTable((reportData) => {
      expect(reportData).to.have.length(3);
    });
    cy.saveAndContinueOnPeopleManifest(false);
    cy.checkNoErrors();
    cy.enterSkipperDetails();
    cy.saveAndContinue();
    cy.checkNoErrors();
    cy.contains('Accept and submit report').click();
    cy.url().should('include', '/save-voyage/page-submitted');
    cy.get('.govuk-panel__title').should('have.text', 'Pleasure Craft Report Submitted');
    cy.navigation('reports');
    cy.checkReports('Submitted', 1);
    cy.contains('View existing reports').click();
    cy.get('.govuk-tabs__list li')
      .within(() => {
        cy.get('#submitted').should('have.text', 'Submitted')
          .click();
      });
    cy.contains('h2', 'Submitted').next().getTable().then((reportData) => {
      cy.wait(2000);
      expect(reportData).to.not.be.empty;
      expectedReport.forEach((item) => expect(reportData).to.deep.include(item));
    });
  });

  afterEach(() => {
    cy.deleteReports();
    localStorage.removeItem('token');
  });
});
