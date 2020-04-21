import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// App imports
import { getData } from '@utils/apiHooks';
import { VESSELS_URL } from '@constants/ApiConstants';

const VesselTable = ({ vesselData, checkboxes, link }) => {
  const [checkedVesselData, setCheckedVesselData] = useState();


  // Handle checkboxes being checked/unchecked
  const handleCheckboxes = (e) => {
    if ((e.target).checked) {
      // Get this vessel data
      getData(`${VESSELS_URL}/${e.target.id}`)
        // Overwrite checkedVesselData with this vesselData
        .then((resp) => setCheckedVesselData(resp));
      // Uncheck every other option
      const vesselCheckboxes = document.querySelectorAll('input[name=vessel]');
      Array.from(vesselCheckboxes).map((vessel) => {
        if (e.target.id !== vessel.id && vessel.checked) {
          vessel.checked = false;
        }
      });
    }
  };


  return (
    <table className="table-clickable govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          {checkboxes === 'true' && (
          <th className="govuk-table__header">
              &nbsp;
          </th>
          )}
          <th className="govuk-table__header">Vessel name</th>
          <th className="govuk-table__header">Vessel type</th>
          <th className="govuk-table__header">Usual moorings</th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {vesselData.map((vessel) => {
          return (
            <tr className="govuk-table__row" key={vessel.id}>
              {checkboxes === 'true' && (
              <td className="govuk-table__cell multiple-choice--hod">
                <div className="govuk-checkboxes__item">
                  <input
                    type="checkbox"
                    className="govuk-checkboxes__input jsCheckbox"
                    id={vessel.id}
                    onChange={(e) => handleCheckboxes(e)}
                    name="vessel"
                  />
                  <label className="govuk-label govuk-checkboxes__label" htmlFor={vessel.id}>&nbsp;</label>
                </div>
              </td>
              )}
              {link === 'true'
                && (
                <td className="govuk-table__cell">
                  <Link to={{
                    pathname: '/vessels/edit-vessel',
                    state: { vesselId: vessel.id },
                  }}
                  >
                    {vessel.vesselName}
                  </Link>
                </td>
                ) }
              {link !== 'true' && <td className="govuk-table__cell">{vessel.vesselName}</td> }
              <td className="govuk-table__cell">{vessel.vesselType}</td>
              <td className="govuk-table__cell">{vessel.moorings}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default VesselTable;
