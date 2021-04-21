/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Navbar, NavDropdown, Nav, Image, ResponsiveEmbed } from 'react-bootstrap';
import './NavBarLoggedIn.css';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { setUser } from '../../actions';
import endPointObj from '../../endPointUrl';

const queryString = require('query-string');

Axios.defaults.withCredentials = true;

function NavBarLoggedIn() {
  const [pic, setPic] = useState(endPointObj.url + 'leo.png');
  const [username_session, setUserName] = useState('');
  const email = useSelector((state) => state.login.username);

  const dispatch = useDispatch();
  const history = useHistory();

  const getAccountInfo = () => {
    return new Promise((resolve) => {
      Axios.get(endPointObj.url + 'accountInfo/' + email, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }).then((response) => {
        // formState(response.data[0].email);
        if (response !== undefined && response.data[0] != undefined) {
          sessionStorage.setItem('currency', response.data[0].currency);
          // sessionStorage.setItem('username', response.data[0].name);

          setUserName(response.data[0].name);

          setPic(response.data[0].photo);

          resolve(response);
        }
      });
    });
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    let email = parsed;
    getAccountInfo(email.email);
  });

  const handleClick = () => {
    history.push('/');
  };

  const AccountPage = (emailId) => {
    history.push({
      pathname: '/account',
      search: `?email=${emailId}`,
    });
  };

  const accountRedirect = () => {
    // eslint-disable-next-line no-undef
    const email = queryString.parse(location.search);
    AccountPage(email.email);
  };

  const logOut = (e) => {
    e.preventDefault();

    dispatch(setUser('Unknown', false, null));
    sessionStorage.clear();
    localStorage.clear();
    handleClick();
    Cookies.remove('name');
  };

  return (
    <Navbar className="nav-bar" expand="lg">
      <Navbar.Brand href="#home">SplitWise</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" />

        <Image className="account-img-height image-bar" src={pic} rounded />
        <NavDropdown
          title={username_session}
          id="basic-nav-dropdown"
          className="NavBarLoggedIn-DropDown"
        >
          <NavDropdown.Item onClick={accountRedirect}>Your Account</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Create a group</NavDropdown.Item>
          <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBarLoggedIn;
