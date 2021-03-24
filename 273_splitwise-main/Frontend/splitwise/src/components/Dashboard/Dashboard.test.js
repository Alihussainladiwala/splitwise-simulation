/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom'
import * as dashFunc from './Dashboard';


afterEach(cleanup);

it("renders", async()=>{
    const {asFragment} =  render(<Dashboard />, { wrapper: MemoryRouter });
    expect(asFragment()).toMatchSnapshot()
})

test('Check for header', async() => {
  const { getByTestId, getByText } = render(<Dashboard />, { wrapper: MemoryRouter });
  expect(getByTestId('Dashboard')).toHaveTextContent("Dashboard")
});
