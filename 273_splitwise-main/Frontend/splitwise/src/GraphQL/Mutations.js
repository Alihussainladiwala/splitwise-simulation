/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */

import { gql } from '@apollo/client';

const AcceptRequest = gql`
  mutation acceptInvite($groupName: String!, $email: String!, $status: String!) {
    acceptInvite(groupName: $groupName, email: $email, status: $status) {
      message
    }
  }
`;

const SignUpRequest = gql`
  mutation signUp($email: String!, $password: String!, $name: String!) {
    signUp(email: $email, password: $password, name: $name) {
      message
    }
  }
`;

const createGroupRequest = gql`
  mutation createGroup($groupName: String!, $members: [String]!, $user: String!) {
    createGroup(groupName: $groupName, members: $members, user: $user) {
      message
    }
  }
`;

const addBillRequest = gql`
  mutation addBill($amount: String!, $billData: String!, $user: String!, $group: String!) {
    addBill(amount: $amount, billData: $billData, user: $user, group: $group) {
      message
    }
  }
`;

const updateAccountInfo = gql`
  mutation updateAccountInfo(
    $currency: String!
    $phoneNo: String!
    $name: String!
    $email: String!
  ) {
    updateAccountInfo(currency: $currency, phoneNo: $phoneNo, name: $name, email: $email) {
      message
    }
  }
`;

export { createGroupRequest, SignUpRequest, addBillRequest, updateAccountInfo, AcceptRequest };
