/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import YourAccount from './YourAccount';
import allReducers from '../../reducers';

import '@testing-library/jest-dom/extend-expect';

const store = createStore(allReducers);

test('rendering Account', () => {
  const history = createMemoryHistory();
  render(
    <Provider store={store}>
      <Router history={history}>
        <YourAccount />
      </Router>
    </Provider>
  );
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(/Your Name/i)).toBeInTheDocument();
  expect(screen.getByText(/Your Email Address/i)).toBeInTheDocument();
});
