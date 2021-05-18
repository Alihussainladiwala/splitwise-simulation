/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setUser } from '../../actions';
import './Login.css';
import { Redirect } from 'react-router-dom';
import endPointObj from '../../endPointUrl';
import { useQuery, useMutation, useLazyQuery, gql } from '@apollo/client';
import { getAccountInfo, loginQuery } from '../../GraphQL/Query';

function Login() {
  // const { error, loading, data } = useQuery(getAccountInfo);
  const [login, { loadingLogin, data }] = useLazyQuery(loginQuery);
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('');
  const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const history = useHistory();

  useEffect(() => {
    console.log(data);
    if (data && data.login.email !== null) {
      console.log(data.login.email);
      Cookies.set('name', 'value', { expires: 1 });
      handleClick(data.login.email);
    }
  }, [data]);

  const handleClick = (emailId) => {
    history.push({
      pathname: '/dashboard',
      search: `?email=${emailId}`,
    });
  };

  // const getAccountInfo = (email) => {
  //   return new Promise((resolve) => {
  //     Axios.get(endPointObj.url + 'accountInfo/' + email).then((response) => {
  //       sessionStorage.setItem('currency', response.data[0].currency);
  //       sessionStorage.setItem('username', response.data[0].username);

  //       resolve(response);
  //     });
  //   });
  // };

  const logIn = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    login({ variables: { email: email, password: password } });

    // const form = e.currentTarget;
    // if (form.checkValidity() === false) {
    //   e.preventDefault();
    //   e.stopPropagation();
    // }
    // setValidated(true);

    // e.preventDefault();
    // Axios.post(endPointObj.url + 'login', {
    //   email,
    //   password,
    // })
    //   .then((response) => {
    //     setAlert('');
    //     dispatch(setUser(response.data[0].username, true));
    //     Cookies.set('name', 'value', { expires: 1 });
    //     //getAccountInfo(email)
    //     handleClick(email);
    //   })
    //   // eslint-disable-next-line no-shadow
    //   .catch((e) => {
    //     if (e.response && e.response.data) {
    //       console.log(e.response.data.message); // some reason error message
    //       setAlert(e.response.data.message);
    //     }
    //   });
  };

  return (
    <Container>
      <Form className="login" validated={validated}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Button onClick={logIn} variant="primary" type="submit">
          Submit
        </Button>

        {alert.length > 0 && (
          <Alert className="alert" key="0" variant="danger">
            {alert}
          </Alert>
        )}
      </Form>
    </Container>
  );
}

export default Login;
