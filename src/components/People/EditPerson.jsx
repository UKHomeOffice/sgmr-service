import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import axios from 'axios';

// App imports
import Auth from '@lib/Auth';
import FormPerson from '@components/People/FormPerson';
import scrollToTopOnError from '@utils/scrollToTopOnError';
import { formatDate, isDateValid, isDateBefore } from '@utils/date';
import { PEOPLE_URL } from '@constants/ApiConstants';
import { PEOPLE_PAGE_URL } from '@constants/ClientConstants';
import { personValidationRules } from '@components/Forms/validationRules';


const EditPerson = (props) => {
  const history = useHistory();
  const personId = props.location.state.peopleId;
  const [personData, setPersonData] = useState();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});

  // Reformat dates & peopleType into individual items for form field display
  const reformatFields = (data) => {
    let formattedFields = { peopleType: data.peopleType.name };
    let originalData = { ...data };

    // Spread date from grouped field to individual fields
    if (data.dateOfBirth) {
      const [dateOfBirthYear, dateOfBirthMonth, dateOfBirthDay] = data.dateOfBirth.split('-');
      delete originalData.dateOfBirth;
      formattedFields = {
        ...formattedFields,
        dateOfBirthYear,
        dateOfBirthMonth,
        dateOfBirthDay,
      };
    }
    if (data.documentExpiryDate) {
      const [documentExpiryDateYear, documentExpiryDateMonth, documentExpiryDateDay] = data.documentExpiryDate.split('-');
      delete originalData.documentExpiryDate;
      formattedFields = {
        ...formattedFields,
        documentExpiryDateYear,
        documentExpiryDateMonth,
        documentExpiryDateDay,
      };
    }

    setPersonData({ ...originalData, ...formattedFields });
  };


  // Get data to prepopulate the form for this person
  const getPersonData = () => {
    axios.get(`${PEOPLE_URL}/${personId}`, {
      headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
    })
      .then((resp) => {
        reformatFields(resp.data);
        localStorage.setItem('data', JSON.stringify(resp.data));
      })
      .catch((err) => {
        if (err.response) {
          switch (err.response.status) {
            case 401: history.push('/sign-in?source=people'); break;
            case 422: history.push('/sign-in?source=people'); break;
            case 405: history.push('/sign-in?source=people'); break;
            default: history.push('/sign-in?source=people');
          }
        }
      });
  };


  // Clear formData from localStorage
  const clearLocalStorage = () => {
    setPersonData({});
    setFormData({});
    setErrors({ });
  };


  // Clear errors
  const removeError = (fieldName) => {
    const errorList = { ...errors };
    let key;

    if (fieldName.includes('dateOfBirth')) {
      key = 'dateOfBirth';
    } else if (fieldName.includes('documentExpiryDate')) {
      key = 'documentExpiryDate';
    } else {
      key = fieldName;
    }
    delete errorList[key];
    setErrors(errorList);
  };


  // Update form info to state
  const handleChange = (e) => {
    // Full data set
    setPersonData({ ...personData, [e.target.name]: e.target.value });
    // Just edited data
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear any errors
    removeError(e.target.name);
  };


  // Check validation
  const areFieldsValid = (dataToValidate) => {
    const fieldsErroring = {};

    // Check required fields are not empty
    personValidationRules.map((rule) => {
      (!(rule.inputField in dataToValidate) || dataToValidate[rule.inputField] === '')
        ? fieldsErroring[rule.errorDisplayId] = rule.message
        : null;
    });

    // Check date fields have valid format
    if (!(isDateValid(dataToValidate.documentExpiryDateYear, dataToValidate.documentExpiryDateMonth, dataToValidate.documentExpiryDateDay))) {
      fieldsErroring.documentExpiryDate = 'You must enter a valid date';
    }
    if (!(isDateValid(dataToValidate.dateOfBirthYear, dataToValidate.dateOfBirthMonth, dataToValidate.dateOfBirthDay))) {
      fieldsErroring.dateOfBirth = 'You must enter a valid date';
    }
    // Date of Birth must be before today
    if (!(isDateBefore(dataToValidate.dateOfBirthYear, dataToValidate.dateOfBirthMonth, dataToValidate.dateOfBirthDay))) {
      fieldsErroring.dateOfBirth = 'You must enter a valid date of birth date';
    }
    // Document expiry date must be after today
    if ((isDateBefore(dataToValidate.documentExpiryDateYear, dataToValidate.documentExpiryDateMonth, dataToValidate.documentExpiryDateDay))) {
      fieldsErroring.documentExpiryDate = 'You must enter a valid document expiry date';
    }

    setErrors(fieldsErroring);
    scrollToTopOnError(fieldsErroring);
    return Object.keys(fieldsErroring).length > 0;
  };


  // Format data so it matches API requirements
  const formatDataToSubmit = (dataForm, dataPerson) => {
    let dataToSubmit = { ...dataForm };

    Object.entries(dataForm).map((field) => {
      const fieldName = field[0];
      const dateFields = ['dateOfBirth', 'documentExpiryDate'];

      dateFields.map((dateField) => {
        if (fieldName.includes(dateField)) {
          // Format date for submission
          dataToSubmit[dateField] = formatDate(
            dataForm[`${dateField}Year`] ? dataForm[`${dateField}Year`] : dataPerson[`${dateField}Year`],
            dataForm[`${dateField}Month`] ? dataForm[`${dateField}Month`] : dataPerson[`${dateField}Month`],
            dataForm[`${dateField}Day`] ? dataForm[`${dateField}Day`] : dataPerson[`${dateField}Day`],
          );
          // Delete any individual date fields
          delete dataToSubmit[`${dateField}Year`];
          delete dataToSubmit[`${dateField}Month`];
          delete dataToSubmit[`${dateField}Day`];
        }
      });
    });
    return dataToSubmit;
  };


  // Handle Submit, including clearing localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData) {
      history.push(PEOPLE_PAGE_URL);
    } else if (!areFieldsValid(personData)) {
      axios.patch(`${PEOPLE_URL}/${personId}`, formatDataToSubmit(formData, personData), {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      })
        .then(() => {
          clearLocalStorage();
          history.push(PEOPLE_PAGE_URL);
        })
        .catch((err) => {
          if (err.response) {
            switch (err.response.status) {
              case 400:
                setErrors({ ...errors, EditPerson: err.response.data.message });
                scrollToTopOnError(err.response);
                break;
              case 401: history.push('/sign-in?source=people'); break;
              case 422: history.push('/sign-in?source=people'); break;
              case 405: history.push('/sign-in?source=people'); break;
              default: history.push('/sign-in?source=people'); break;
            }
          }
        });
    }
  };

  // Get person data to pass to prepopulate the form
  useEffect(() => {
    getPersonData();
  }, []);

  // Update localStorage if personData or errors changes
  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(personData));
  }, [personData]);
  useEffect(() => {
    localStorage.setItem('errors', JSON.stringify(errors));
  }, [errors]);

  return (
    <div className="govuk-width-container ">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href={PEOPLE_PAGE_URL}>People</a>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">Edit person</li>
        </ol>
      </div>
      <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-xl">Edit person</h1>
            <p className="govuk-body-l">Update the details of the person you want to edit.</p>
            <form id="EditPerson">

              {Object.keys(errors).length > 0 && (
                <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                  <h2 className="govuk-error-summary__title">
                    There is a problem
                  </h2>
                  {errors.EditPerson
                    && (
                    <span className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>
                      {errors.EditPerson}
                    </span>
                    )}
                </div>
              )}


              <FormPerson
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                data={personData}
                errors={errors}
              />

              <p>
                <a href={PEOPLE_PAGE_URL} className="govuk-link govuk-link--no-visited-state" onClick={(e) => clearLocalStorage(e)}>Exit without saving</a>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withRouter(EditPerson);