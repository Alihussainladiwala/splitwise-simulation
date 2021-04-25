/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosMock from 'axios';
import VerticalNav from './VerticalNav';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import allReducers from '../../reducers';
import { createStore } from 'redux';

const store = createStore(allReducers);

test('should not display groups', async () => {
  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <VerticalNav />
    </Provider>
  );

  expect(() => getByTestId('Group')).toThrow('Unable to find an element by: [data-testid="Group"]');
});

test('should display groups', () => {
  const mockGroups = [{ groupName: 'firstGroup' }];

  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <VerticalNav groups={mockGroups} />
    </Provider>
  );

  expect(getByTestId('Group')).toBe;
});
