import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Submit a Pleasure Craft Report</h1>
            <p className="govuk-body">Use this service to:</p>
            <ul className="govuk-list govuk-list--bullet govuk-!-margin-bottom-7">
              <li>Tell Border Force you are sailing to or from the UK in a General Maritime Pleasure Craft</li>
              <li>Change or update your information </li>
            </ul>
            <Link to="/sign-in" role="button" draggable="false" className="govuk-button govuk-!-margin-bottom-7 govuk-button--start" data-module="govuk-button">
              Start now
              <svg
                className="govuk-button__start-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="17.5"
                height="19"
                viewBox="0 0 33 40"
                aria-hidden="true"
                focusable="false"
              >
                <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
              </svg>
            </Link>
            <h2 className="govuk-heading-m">Before you start</h2>
            <p className="govuk-body">You will need:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>details of your vessel</li>
              <li>names and passport details for everyone who will be on board</li>
              <li>Details of the ports you plan to use</li>
            </ul>
          </div>
          <div className="govuk-grid-column-one-third">
            <aside className="app-related-items">
              <h3 className="govuk-heading-m">Related content</h3>
              <ul className="govuk-list govuk-!-font-size-16">
                <li><a className="govuk-link" target="blank" href="https://www.gov.uk/browse/abroad/travel-abroad">Travel abroad</a></li>
                <li><a className="govuk-link" target="blank" href="https://www.gov.uk/government/collections/send-advance-passenger-information">Send Advance Passenger Information</a></li>
                <li><a className="govuk-link" target="blank" href="https://www.gov.uk/government/publications/notice-8-sailing-your-pleasure-craft-to-and-from-the-uk">Notice 8: sailing your pleasure craft to and from the UK</a></li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
