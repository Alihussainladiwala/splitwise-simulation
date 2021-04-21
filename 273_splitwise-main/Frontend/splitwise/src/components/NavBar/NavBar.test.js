/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import NavBar from './NavBar';
import allReducers from '../../reducers';
import { createStore } from 'redux';

import '@testing-library/jest-dom/extend-expect';

const store = createStore(allReducers);

test('rendering NavBar', () => {
  const history = createMemoryHistory();
  render(
    <Provider store={store}>
      <Router history={history}>
        <NavBar />
      </Router>
    </Provider>
  );
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(/LogIn/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});
