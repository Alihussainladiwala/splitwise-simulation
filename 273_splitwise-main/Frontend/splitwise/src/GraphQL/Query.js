/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */

import { gql } from '@apollo/client';

const getAllUsers = gql`
  query {
    getAllUsers {
      username
      email
    }
  }
`;

const getAccountInfo = gql`
  query getAccountInfo($email: String!) {
    getAccountInfo(email: $email) {
      email
      currency
      timezone
      photo
      currency
      phoneNo
      username
    }
  }
`;

const loginQuery = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      message
    }
  }
`;

const fetchBillsRequest = gql`
  query fetchBills($group: String!) {
    fetchBills(group: $group) {
      groupName
      billData
      time
      amount
      sender
    }
  }
`;

const fetchInvitesRequest = gql`
  query getInvites($email: String!) {
    getInvites(email: $email) {
      invitedby
      groupName
      email
    }
  }
`;

const fetchGroupsRequest = gql`
  query getGroups($email: String!) {
    getGroups(email: $email) {
      groupName
    }
  }
`;

const getAmountRequest = gql`
  query getAmount($email: String!) {
    getAmount(email: $email) {
      email
      amt
    }
  }
`;

export {
  loginQuery,
  getAccountInfo,
  getAllUsers,
  fetchBillsRequest,
  fetchInvitesRequest,
  fetchGroupsRequest,
  getAmountRequest,
};
