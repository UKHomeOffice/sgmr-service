import React, { useState, useEffect } from 'react';
// This page is currently hard coded for /reports only

const SectionTabs = (props) => {
  const [data, setData] = useState();
  const [tabData, setTabData] = useState([]);

  // Temp data until connect to API
  const tabs = [
    {
      name: 'draft',
      text: 'Draft',
      active: true,
    },
    {
      name: 'submitted',
      text: 'Submitted',
      active: false,
    }, {
      name: 'cancelled',
      text: 'Cancelled',
      active: false,
    },
  ];
  const tabledraft = [
    {
      section: 'draft',
      text: 'Draft',
      headings: [
        'Vessel',
        'Departure date',
        'Departure time',
        'Departure port',
        'Arrival port',
        'Submission reference',
      ],
      items: [
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'In Deep Ship',
          departureDate: '10/01/20',
          departureTime: '11:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '',
          status: 'draft',
        },
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'Serenity',
          departureDate: '10/01/20',
          departureTime: '12:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '',
          status: 'draft',
        },
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'Baroness',
          departureDate: '10/01/20',
          departureTime: '15:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '',
          status: 'draft',
        },
      ],
    },
  ];
  const tablesubmitted = [
    {
      section: 'submitted',
      text: 'Submitted',
      headings: [
        'Vessel',
        'Departure date',
        'Departure time',
        'Departure port',
        'Arrival port',
        'Submission reference',
      ],
      items: [
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'Baroness',
          departureDate: '10/01/20',
          departureTime: '15:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '987tdou6thr5ed41',
          status: 'draft',
        },
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'Baroness',
          departureDate: '10/01/20',
          departureTime: '15:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '456873fhyg9kud87',
          status: 'submitted',
        },
      ],
    },
  ];
  const tablecancelled = [
    {
      section: 'cancelled',
      text: 'Cancelled',
      headings: [
        'Vessel',
        'Departure date',
        'Departure time',
        'Departure port',
        'Arrival port',
        'Submission reference',
      ],
      items: [
        {
          id: '05b21e40-cbee-46be-8d61-b24978f32b24',
          name: 'Baroness',
          departureDate: '10/01/20',
          departureTime: '15:00',
          departurePort: 'GB PME',
          arrivalPort: 'FR BOD',
          submissionRef: '',
          status: 'cancelled',
        },
      ],
    },
  ];

  const setActiveTab = (e) => {
    const tempArr = [...tabData];
    let tableName;
    switch (e.target.id) {
      case 'draft': tableName = tabledraft; break;
      case 'submitted': tableName = tablesubmitted; break;
      case 'cancelled': tableName = tablecancelled; break;
      default: tableName = tabledraft;
    }
    tempArr.map((elem, i) => {
      if (e.target.id === elem.name) {
        elem.active = true;
        setData(tableName);
      } else {
        elem.active = false;
      }
    });
    setTabData(tempArr);
  };

  useEffect(() => {
    setTabData(tabs);
    setData(tabledraft);
  }, []);

  if (!data) { return (<></>); }
  return (
    <div className="govuk-width-container">
      <div className="govuk-grid-column-full">
        <hr className="govuk-section-break govuk-section-break--visible govuk-section-break--xl govuk-!-margin-top-0" />
      </div>
      <div className="govuk-tabs" data-module="govuk-tabs">
        {/* The h2 is only visible on small screens (GDS controlled) */}
        <h2 className="govuk-tabs__title">
          Contents
        </h2>

        <ul className="govuk-tabs__list">
          {tabData.map((elem, i) => {
            return (
              <li
                key={i}
                className={elem.active === true ? 'govuk-tabs__list-item govuk-tabs__list-item--selected' : 'govuk-tabs__list-item'}
                onClick={(e) => setActiveTab(e)}
              >
                <p id={elem.name} className="govuk-tabs__tab">
                  {elem.text}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="govuk-tabs__panel" id={data[0].section}>
          <h2 className="govuk-heading-l">{data[0].text}</h2>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                {data[0].headings.map((elem, i) => {
                  return (
                    <th key={i} scope="col" className="govuk-table__header">{elem}</th>
                  );
                })}
                </tr>
              </thead>
              <tbody>
                {data[0].items.map((elem, i) => {
                  return (
                  <tr className="govuk-table__row" key={i}>
                    <td className="govuk-table__cell">{elem.name}</td>
                    <td className="govuk-table__cell">{elem.departureDate}</td>
                    <td className="govuk-table__cell">{elem.departureTime}</td>
                    <td className="govuk-table__cell">{elem.departurePort}</td>
                    <td className="govuk-table__cell">{elem.arrivalPort}</td>
                    <td className="govuk-table__cell">{elem.submissionRef}</td>
                  </tr>
                  );
                })}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectionTabs;
