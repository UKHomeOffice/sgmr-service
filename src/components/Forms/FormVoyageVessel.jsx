import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

// app imports
import { apiPath } from 'config';
import Auth from 'Auth';
import contentArray from 'contentArray';
import CreateVessel from 'CreateVessel';


const FormVoyageVessel = () => {
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname.slice(1);
  const urlParams = location.search.split('source=');
  const [titles, setTitles] = useState();
  const [vessels, setVessels] = useState();
  const [apiErrors, setApiErrors] = useState();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const arr = contentArray;

  const getTitles = () => {
    const page = arr.find((obj) => {
      return obj.urlStub === '/vessels';
    });
    setTitles(page.reportTitles);
  };

  const getData = () => {
    axios.get(`${apiPath}/user/vessels?pagination=false`, {
      headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
    })
      .then((resp) => {
        setVessels(resp.data.vessels);
      })
      .catch((err) => {
        if (err.response) {
          switch (err.response.status) {
            case 401: history.push(`/sign-in?source=${location}`); break;
            case 422: history.push(`/sign-in?source=${location}`); break;
            case 405: history.push(`/sign-in?source=${location}`); break;
            default: setApiErrors({ ...apiErrors, main: 'Something went wrong' });
          }
        }
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle create vessel
  const validationRules = [
    {
      field: 'name',
      rule: 'required',
      message: 'You must enter a name',
    },
    {
      field: 'vesselType',
      rule: 'required',
      message: 'You must enter a vessel type',
    },
    {
      field: 'vesselBase',
      rule: 'required',
      message: 'You must enter a usual mooring',
    },
    {
      field: 'registration',
      rule: 'required',
      message: 'You must enter the registration',
    },
  ];
  // Handle missing required fields
  const checkRequiredFields = () => {
    const tempObj = {};
    validationRules.map((elem) => {
      (!(elem.field in formData) || formData[elem.field] === '')
        ? tempObj[elem.field] = elem.message
        : null;
    });
    setErrors(tempObj);
    return Object.keys(tempObj).length > 0;
  };// Validation
  const removeError = (fieldName) => {
    const tempArr = { ...errors };
    const key = fieldName;
    delete tempArr[key];
    setErrors(tempArr);
  };
  // Ensure we have correct formatting
  const getFieldsToSubmit = () => {
    const dataSubmit = {
      name: formData.name,
      vesselType: formData.vesselType,
      vesselBase: formData.vesselBase,
      registration: formData.registration,
    };
    return dataSubmit;
  };

  const handleCreateVessel = () => {
    if (checkRequiredFields() === false) {
      axios.post(`${apiPath}/user/vessels`, getFieldsToSubmit(), {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      })
        .then(() => {
          console.log('vessel added');
        })
        .catch((err) => {
          if (err.response) {
            if (err.response) {
              switch (err.response.status) {
                case 400: setErrors({ ...errors, CreateVessel: 'This vessel already exists' }); break;
                case 422: history.push(`/sign-in?source=${path}`); break;
                case 405: history.push(`/sign-in?source=${path}`); break;
                default: setErrors({ ...errors, CreateVessel: 'Something went wrong' });
              }
            }
          }
        });
    } else {
      // This means there are errors, so jump user to the error box
      history.push('#CreateVessel');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateVessel();
  };

  useEffect(() => {
    getTitles();
    getData();
  }, []);

  if (!titles || !vessels) { return (null); }
  return (
    <section>
      <h1 className="govuk-heading-xl">Vessel details</h1>
      <h2 className="govuk-heading-l">Saved vessels</h2>
      <p className="govuk-body-l">Add the details of a vessel you have saved previously to the report</p>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header">&nbsp;</th>
            {titles.map((elem, i) => {
              return (
                <th className="govuk-table__header" scope="col" key={i}>{elem}</th>
              );
            })}
          </tr>
          </thead>
          <tbody className="govuk-table__body">
            {vessels.map((elem, i) => {
              return (
                <tr className="govuk-table__row" key={i}>
                  <td className="govuk-table__cell multiple-choice--hod">
                    <div className="govuk-checkboxes__item">
                      <input
                        type="checkbox"
                        className="govuk-checkboxes__input jsCheckbox"
                        id={elem.id}
                        name={elem.name}
                        value={elem.name}
                        onChange={(e) => handleChange(e)}
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor={elem.id}>&nbsp;</label>
                    </div>
                  </td>
                  <td className="govuk-table__cell" scope="row">{elem.name}</td>
                  <td className="govuk-table__cell">{elem.vesselType}</td>
                  <td className="govuk-table__cell">{elem.vesselBase}</td>
                </tr>
              );
            })}
          </tbody>
      </table>
      <h2 className="govuk-heading-l">New vessel</h2>
      <p className="govuk-body-l">Add the details of a new vessel you have not already saved</p>

      <CreateVessel
        // handleSubmit={(e) => handleCreateVessel(e)}
        handleChange={(e) => handleChange(e)}
        data={formData}
        errors={errors}
      />

      <button
        className="govuk-button"
        data-module="govuk-button"
        onClick={(e) => handleSubmit(e)}
      >
        Save and continue
      </button>
    </section>
  );
};

export default FormVoyageVessel;
