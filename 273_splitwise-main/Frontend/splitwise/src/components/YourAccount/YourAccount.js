/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Container, Image } from 'react-bootstrap';
import './YourAccount.css';
import Axios from 'axios';
import leo from './holder.png';
import endPointObj from '../../endPointUrl';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { getAccountInfo as getAccountInfoRequest } from '../../GraphQL/Query';
import { updateAccountInfo as updateAccountInfoRequest } from '../../GraphQL/Mutations';

const queryString = require('query-string');

function YourAccount() {
  const [updateAccount, { errorData }] = useMutation(updateAccountInfoRequest);
  const [form, formState] = useState({
    name: '',
    email: '',
    phoneNo: '',
    currency: '',
  });

  const { error, loading, data } = useQuery(getAccountInfoRequest, {
    variables: { email: queryString.parse(location.search).email },
  });

  const [pic, setPic] = useState(endPointObj.url + 'leo.png');

  const [file, setFile] = useState('');

  const changedCurrency = (e) => {
    let curr = new Map();
    curr.set('USD', '');
    curr.set('GBP', 'en-gb');

    sessionStorage.setItem('currency', curr.get(e.target.value));
  };

  const changedPhone = (e) => {
    sessionStorage.setItem('tempPhone', e.target.value);
  };

  const changedName = (e) => {
    sessionStorage.setItem('tempName', e.target.value);
  };

  const getAccountInfo = (email) => {
    return new Promise((resolve) => {
      Axios.get(endPointObj.url + 'accountInfo/' + email).then((response) => {
        resolve(response);
      });
    });
  };

  function updateAccountInfo(email, name, currency, phoneNo) {
    // return new Promise((resolve) => {
    //   Axios.post(endPointObj.url + 'updateAccountInfo', {
    //     email: email,
    //     name: name,
    //     currency: currency,
    //     phoneNo: phoneNo,
    //   }).then((response) => {
    //     resolve(response);
    //     // getAccountInfo(email).then((result) => {
    //     //   sessionStorage.setItem('currency', result.data[0].currency);
    //     // });
    //   });
    // });
    updateAccount({
      variables: {
        currency: currency,
        phoneNo: phoneNo,
        name: name,
        email: email,
      },
    }).then((result) => {
      console.log(result);
      if (result.data) {
        // setAlert(result.data.signUp.message);
        console.log('updated account info');
      } else {
        // Cookies.set('name', 'value', { expires: 1 });
        // loginRequest(emailReg, passwordReg);
      }
    });
  }

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const emailId = queryString.parse(location.search);

    console.log(data);

    if (data && data.getAccountInfo.email) {
      let curr = new Map();
      curr.set('', 'USD');
      curr.set('en-gb', 'GBP');

      sessionStorage.setItem('tempName', data.getAccountInfo.username),
        sessionStorage.setItem('currency', data.getAccountInfo.currency),
        sessionStorage.setItem('tempPhone', data.getAccountInfo.phoneNo);

      formState({
        name: data.getAccountInfo.username,
        email: data.getAccountInfo.email,
        phoneNo: data.getAccountInfo.phoneNo,
        currency: curr.get(data.getAccountInfo.currency),
      });

      setPic(endPointObj.url + data.getAccountInfo.photo);
    }

    // getAccountInfo(emailId.email).then((result) => {
    //   let curr = new Map();
    //   curr.set('', 'USD');
    //   curr.set('en-gb', 'GBP');

    //   formState({
    //     name: result.data[0].username,
    //     email: result.data[0].email,
    //     phoneNo: result.data[0].phoneNo,
    //     currency: curr.get(result.data[0].currency),
    //   });
    //   setPic(endPointObj.url + result.data[0].photo);
    // });

    return () => {
      console.log('updating....');
      if (data) {
        updateAccountInfo(
          emailId.email,
          sessionStorage.getItem('tempName'),
          sessionStorage.getItem('currency'),
          sessionStorage.getItem('tempPhone')
        );
      }
    };
  }, [data]);

  function fileChangehandler(event) {
    setFile(event.target.files[0]);
  }

  function fileUpload(email) {
    const data = new FormData();
    data.append('name', 'file_name.jpg');
    data.append('file', file);

    Axios.post(endPointObj.url + 'upload/' + email, data)
      .then((res) => {
        getAccountInfo(email).then((result) => {
          setPic(endPointObj.url + result.data[0].photo);
          setFile('');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Row className="account-row-height">
      <Col className="account-col-height">
        <Row>
          <Col>
            <Image className="account-img-height" src={pic} rounded />
            <Row className="choose-buttons">
              <input type="file" id="file" accept=".jpg" onChange={(e) => fileChangehandler(e)} />
              <button onClick={() => fileUpload(form.email)}>upload</button>
            </Row>
          </Col>

          <Col className="user-data">
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                placeholder="Disabled input"
                defaultValue={form.name}
                onChange={(e) => changedName(e)}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Your Email Address</Form.Label>
              <Form.Control
                placeholder="Disabled input"
                defaultValue={form.email}
                onChange={(e) => changedEmail(e)}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Your Phone</Form.Label>
              <Form.Control
                placeholder="Disabled input"
                defaultValue={form.phoneNo}
                onChange={(e) => changedPhone(e)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Col>
      <Col className="account-form">
        <Container>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={(e) => changedCurrency(e)}>
              <option value="" selected disabled hidden>
                {form.currency}
              </option>
              <option>USD</option>
              <option>GBP</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Timezone</Form.Label>
            <Form.Control as="select" disabled>
              <option>(UTC-08:00) Baja California</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Language</Form.Label>
            <Form.Control as="select" disabled>
              <option>English</option>
            </Form.Control>
          </Form.Group>
        </Container>
      </Col>
    </Row>
  );
}

export default YourAccount;
