import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageAccount from '../PageAccount';
import UserContext from '../UserContext';

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions,
  );
};

const providerProps = {
  user: {
    dateCreated: '2020-10-05T09:39:21.824679',
    email: 'John_Doe@test.com',
    firstName: 'John',
    id: '44acf985-1982-49aa-ac3b-15d365de163a',
    lastName: 'Doe',
    lastUpdated: '2020-10-08T09:55:35.504039',
    mobileNumber: '07444112888',
    people: [],
    role: { name: 'User', id: '2a960d7a-6bca-4453-8f5c-acbb8b0f9403' },
    state: 'verified',
    vessels: [],
  },
};

test('PageAccount displays the users details', () => {

  customRender(<PageAccount />, { providerProps });

  expect(screen.getByText('First name')).toBeInTheDocument();
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('John_Doe@test.com')).toBeInTheDocument();
  expect(screen.getByText('07444112888')).toBeInTheDocument();

  describe('Edit Account button displayed', () => {
    expect(screen.getByRole('button')).toHaveTextContent('Edit Account');
  });
});
