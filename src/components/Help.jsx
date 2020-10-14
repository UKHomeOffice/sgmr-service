import React from 'react';

const Help = () => {
  return (
    <div className="govuk-width-container ">
      <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
        <p className="govuk-body-l">
          <span style={{ color: 'white', backgroundColor: '#1d70b8' }}>This service is to support consultation as a BETA  demonstrator. No data will be submitted during the consultation period. </span>
        </p>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-xl">Help</h1>
            <p className="govuk-body">
              This is relevant to all general maritime departures sailing to and from UK  locations for pleasure craft. You are required to complete an Advance Application prior to your departure at least 2 hours prior to embarkation.
            </p>
            <h1 className="govuk-heading-m">Applicability</h1>
            <p className="govuk-body">
              Anyone who owns, or is responsible for (captain or skipper), a pleasure craft  (such as a yacht) that sails to or from locations outside the UK is required to provide pleasure craft and goods documentation.
            </p>
            <h1 className="govuk-heading-m">Defining a Pleasure Craft</h1>
            <p className="govuk-body">
              The Maritime &amp; Coastguard defines a pleasure craft as those used for sport or recreational purposes and do not operate for financial gain – See Pleasure Craft – UK Regulations in the Related Links. 
            </p>
            <h1 className="govuk-heading-m">How the information is used </h1>
            <p className="govuk-body">
              The data you provide on the Advance  Application about your trip will be used to notify Border Force and HMRC (for Duty and Customers purposes) of your arrival plans. Border Force is committed to understanding and responding to the needs of the recreational boating community.  
            </p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h1 className="govuk-heading-m">Related Links</h1>
            <ul className="govuk-list govuk-list--bullet">
              <li><a className="govuk-link" target="blank" href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/268868/mgn489-amendment-pleasure-vessels.pdf">Pleasure Craft – UK Regulations</a></li>
              <li><a className="govuk-link" target="blank" href="https://www.gov.uk/browse/abroad/travel-abroad">Travel Abroad</a></li>
              <li><a className="govuk-link" target="blank" href="https://www.gov.uk/government/collections/send-advance-passenger-information">Advance Application to notify of General Maritime (Pleasure Craft)</a></li>
              <li><a className="govuk-link" target="blank" href="https://www.gov.uk/government/organisations/border-force">UK Border Force</a></li>
              <li><a className="govuk-link" target="blank" href="https://www.gov.uk/government/organisations/hm-revenue-customs">HMRC</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Help;
