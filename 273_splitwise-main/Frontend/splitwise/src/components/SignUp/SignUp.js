/* eslint-disable prefer-template */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import './SignUp.css';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from '../../actions';
import endPointObj from '../../endPointUrl';

function SignUp() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [validated, setValidated] = useState(false);
  const [emailReg, setEmailReg] = useState('');
  const [alert, setAlert] = useState('');
  const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const history = useHistory();

  const handleClick = () => {
    history.push({
      pathname: '/dashboard',
    });
  };

  // eslint-disable-next-line no-shadow
  const logIn = (emailReg, passwordReg) => {
    Axios.post(endPointObj.url + 'login', {
      email: emailReg,
      password: passwordReg,
    })
      .then((response) => {
        localStorage.setItem('token', response.data.token.split(' ')[1]);
        handleClick(emailReg);
        dispatch(setUser(emailReg, true));
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.message); // some reason error message
          // setAlert(e.response.data.message);
        }
      });
  };

  const register = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('not validated');
      e.preventDefault();
      e.stopPropagation();
    }
    console.log(form.checkValidity());
    e.preventDefault();
    setValidated(true);

    if (usernameReg.length !== 0 && passwordReg.length !== 0 && emailReg.length !== 0) {
      Axios.post(endPointObj.url + 'signUp', {
        name: usernameReg,
        password: passwordReg,
        email: emailReg,
      })
        .then(() => {
          Cookies.set('name', 'value', { expires: 1 });
          logIn(emailReg, passwordReg);
          setAlert('');
        })
        .catch((err) => {
          console.log('error');
          if (err.response && err.response.data) {
            setAlert(err.response.data.message);
          }
        });
    }
  };

  return (
    <div>
      <Card className="bg-light text-black signUp-card">
        <Container>
          <Form className="signup-div" validated={validated} onSubmit={register}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setUsernameReg(e.target.value);
                }}
                placeholder="Enter name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => {
                  setEmailReg(e.target.value);
                }}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPasswordReg(e.target.value);
                }}
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            {alert.length > 0 && (
              <Alert className="alert" key="0" variant="danger">
                {alert}
              </Alert>
            )}
          </Form>
        </Container>
      </Card>
    </div>
  );
}

export default SignUp;
