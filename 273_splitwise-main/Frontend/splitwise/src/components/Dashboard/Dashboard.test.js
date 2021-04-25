// /* eslint-disable react/jsx-filename-extension */
// /* eslint-disable */
// import React from 'react';
// import { render, cleanup } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Dashboard from './Dashboard';
// import { MemoryRouter } from 'react-router-dom'
// import * as dashFunc from './Dashboard';

// afterEach(cleanup);

// it("renders", async()=>{
//     const {asFragment} =  render(<Dashboard />, { wrapper: MemoryRouter });
//     expect(asFragment()).toMatchSnapshot()
// })

// test('Check for header', async() => {
//   const { getByTestId, getByText } = render(<Dashboard />, { wrapper: MemoryRouter });
//   expect(getByTestId('Dashboard')).toHaveTextContent("Dashboard")
// });

/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
// import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import allReducers from '../../reducers';
import NavBarLoggedIn from '../NavBarLoggedIn/NavBarLoggedIn';

const store = createStore(allReducers);

const component = TestRenderer.create(
  <Provider store={store}>
    <MemoryRouter>
      <Dashboard></Dashboard>{' '}
    </MemoryRouter>
  </Provider>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for header', async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard></Dashboard>{' '}
      </MemoryRouter>
    </Provider>
  );
  expect(getByTestId('Dashboard')).toHaveTextContent('Dashboard');
});
