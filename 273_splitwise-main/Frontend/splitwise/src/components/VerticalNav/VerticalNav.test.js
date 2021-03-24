/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosMock from 'axios';
import VerticalNav from './VerticalNav';
import { MemoryRouter } from 'react-router-dom'



test("should not display groups", async () =>{

    const {getByTestId, getByText } = render(<VerticalNav/>)

    expect(()=> getByTestId('Group')).toThrow('Unable to find an element by: [data-testid="Group"]')
})



test("should display groups", () =>{

    const mockGroups = [{groupName: "firstGroup"}]

    const {getByTestId, getByText } = render(<VerticalNav groups= {mockGroups} />)

    expect(getByTestId('Group')).toBe
})