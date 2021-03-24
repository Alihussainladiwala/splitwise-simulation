/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import NavBar  from './NavBar'

import '@testing-library/jest-dom/extend-expect'



test('rendering NavBar', () => {
    const history = createMemoryHistory()
    render(
      <Router history={history}>
        <NavBar />
      </Router>
    )
    // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(/LogIn/i)).toBeInTheDocument()
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument()
})