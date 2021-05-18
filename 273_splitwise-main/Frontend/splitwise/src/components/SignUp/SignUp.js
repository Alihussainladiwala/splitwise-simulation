/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import './SignUp.css';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from '../../actions';
import endPointObj from '../../endPointUrl';
import {SignUpRequest} from '../../GraphQL/Mutations'
import {loginQuery}  from '../../GraphQL/Query'
import { useMutation, useLazyQuery } from "@apollo/client";


function SignUp() {
  const [signUp, { error }] = useMutation(SignUpRequest);
  const [login, { loading, data }] = useLazyQuery(loginQuery);
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [validated, setValidated] = useState(false);
  const [emailReg, setEmailReg] = useState('');
  const [alert, setAlert] = useState('');
  const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const history = useHistory();

  const handleClick = (emailId) => {
    history.push({
      pathname: '/dashboard',
      search: `?email=${emailId}`,
    });
  };

  // // eslint-disable-next-line no-shadow
  // const logIn = (emailReg, passwordReg) => {
  //   Axios.post(endPointObj.url + 'login', {
  //     email: emailReg,
  //     password: passwordReg,
  //   })
  //     .then((response) => {
  //       handleClick(emailReg);
  //       dispatch(setUser(response.data[0].username, true));
  //     })
  //     .catch((e) => {
  //       if (e.response && e.response.data) {
  //         console.log(e.response.data.message); // some reason error message
  //         // setAlert(e.response.data.message);
  //       }
  //     });
  // };




  // const register = (e) => {
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }

  //   setValidated(true);

  //   e.preventDefault();

  //   if (usernameReg.length !== 0 && passwordReg.length !== 0 && emailReg.length !== 0) {
  //     Axios.post(endPointObj.url + 'signUp', {
  //       username: usernameReg,
  //       password: passwordReg,
  //       email: emailReg,
  //     })
  //       .then(() => {
  //         Cookies.set('name', 'value', { expires: 1 });
  //         logIn(emailReg, passwordReg);
  //         setAlert('');
  //       })
  //       .catch((err) => {
  //         console.log('error');
  //         if (err.response && err.response.data) {
  //           setAlert(err.response.data.message);
  //         }
  //       });
  //   }
  // };

  useEffect(() => {
    if(data && data.login.email){
      dispatch(setUser(data.login.email, true));
      handleClick(emailReg);

    }
  },[data]);

  const loginRequest = (email, password) => {
    login({ variables: { email: email,   password: password } })   
  };

  const register = (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        }

    signUp({
      variables: {
        email: emailReg,
        password: passwordReg,
        name: usernameReg,
      }
     
    }).then((result) => {
      console.log(result);
      if(result.data.signUp && result.data.signUp.message.toLowerCase() == "user already exists")
      {
        setAlert(result.data.signUp.message);
       
      }
      else{
        Cookies.set('name', 'value', { expires: 1 });
        loginRequest(emailReg, passwordReg);
      }
    
    })

    if (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className="bg-light text-black signUp-card">
        <Container>
          <Form className="signup-div" validated={validated}>
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
            <Button onClick={register} variant="primary" type="submit">
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
