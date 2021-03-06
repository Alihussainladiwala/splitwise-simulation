/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setUser } from '../../actions';
import './Login.css';
import { Redirect } from 'react-router-dom';
import endPointObj from '../../endPointUrl';

function Login() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('');
  const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const history = useHistory();

  const handleClick = (emailId) => {
    history.push({
      pathname: '/dashboard',
    });
  };

  const getAccountInfo = (email) => {
    return new Promise((resolve) => {
      Axios.get(endPointObj.url + 'accountInfo/' + email).then((response) => {
        sessionStorage.setItem('currency', response.data[0].currency);
        sessionStorage.setItem('username', response.data[0].username);

        resolve(response);
      });
    });
  };

  const logIn = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    e.preventDefault();
    Axios.post(endPointObj.url + 'login', {
      email,
      password,
    })
      .then((response) => {
        // setAlert('');
        // dispatch(setUser(response.data[0].username, true));
        // Cookies.set('name', 'value', { expires: 1 });
        // //getAccountInfo(email)
        // handleClick(email);
        localStorage.setItem('token', response.data.token.split(' ')[1]);
        dispatch(setUser(email, true));
        handleClick();
      })
      // eslint-disable-next-line no-shadow
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.message); // some reason error message
          setAlert(e.response.data.message);
        }
      });
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
