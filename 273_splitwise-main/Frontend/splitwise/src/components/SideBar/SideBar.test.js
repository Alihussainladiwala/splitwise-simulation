/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosMock from 'axios';
import SideBar from './SideBar';
import { MemoryRouter } from 'react-router-dom';
var numeral = require('numeral');

test('should not display groups', async () => {
  const { getByTestId, getByText } = render(<SideBar />);

  expect(() => getByTestId('Member')).toThrow(
    'Unable to find an element by: [data-testid="Member"]'
  );
});

test('should display groups', () => {
  const mockMembers = [{ email: 'ali@gmail.com', amt: 10 }];
  const mockDashboard = false;
  numeral.locale('');
  numeral.defaultFormat('$0,0.00');

  const { getByTestId, getByText } = render(
    <SideBar numeral={numeral} members={mockMembers} Dashboard={mockDashboard} />
  );

  expect(getByTestId('Member')).toBeInTheDocument();
});
