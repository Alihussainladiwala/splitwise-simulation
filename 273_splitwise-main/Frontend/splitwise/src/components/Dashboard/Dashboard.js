/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Nav,
  Row,
  Col,
  Button,
  Card,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Container,
  ListGroup,
  Modal,
  Form,
} from 'react-bootstrap';
import Axios from 'axios';
import './Dashboard.css';
import VerticalNav from '../VerticalNav/VerticalNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import SideBar from '../SideBar/SideBar';
const queryString = require('query-string');
import 'numeral/locales/en-gb';
import endPointObj from '../../endPointUrl';
import { fetchInvitesRequest, fetchGroupsRequest, getAmountRequest } from '../../GraphQL/Query';
import { useLocation, Switch } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { AcceptRequest } from '../../GraphQL/Mutations';

var numeral = require('numeral');

function Dashboard() {
  const location = useLocation();
  const [acceptInvite, { error }] = useMutation(AcceptRequest);

  const queryMultiple = () => {
    const res1 = useQuery(fetchInvitesRequest, {
      variables: { email: queryString.parse(location.search).email },
    });

    const res2 = useQuery(fetchGroupsRequest, {
      variables: { email: queryString.parse(location.search).email },
    });

    const res3 = useQuery(getAmountRequest, {
      variables: { email: queryString.parse(location.search).email },
    });

    return [res1, res2, res3];
  };

  const [
    { loading: loading1, data: dataInvite },
    { loading: loading2, data: dataGroup },
    { loading: loading3, data: dataAmount },
  ] = queryMultiple();

  // const { error, loading, data } = useQuery(fetchInvitesRequest, {
  //   variables: { email: queryString.parse(location.search).email },
  // });
  const [show, setShow] = useState(false);
  const [showOwed, setShowOwed] = useState(false);

  const handleClose = () => {
    setAmount('money!');
    setShow(false);
    setShowOwed(false);
  };
  const handleShow = () => setShow(true);

  const handleShowOwed = () => setShowOwed(true);

  const [groups, setGroups] = useState([]);
  const [invites, setInvites] = useState([]);
  const [owe, setYouOwe] = useState([]);
  const [owed, setYouAreOwed] = useState([]);
  const [amount, setAmount] = useState('money!');
  const [reciever, setReciever] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [youOwe, setYouOweTotal] = useState(0);
  const [youOwed, setYouOwedTotal] = useState(0);

  if (Cookies.get('name')) {
    console.log('loaded cookie');
  }

  // const getGroups = (email) => {
  //   Axios.get(endPointObj.url + 'groups/' + email)
  //     .then((response) => {
  //       // eslint-disable-next-line no-console
  //       setGroups(response.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  useEffect(() => {
    // if (Cookies.get('userId')) {
    //   console.log('loaded cookie');
    // }
    numeral.reset();
    numeral.defaultFormat('$0,0.00');

    numeral.locale(sessionStorage.getItem('currency'));

    const parsed = queryString.parse(location.search);
    let email = parsed;
    // getGroups(email.email);

    // getInvites(email.email).then((result) => {
    //   setInvites(result);
    // });

    if (dataInvite) {
      console.log(dataInvite);
      setInvites(dataInvite.getInvites);
    }

    console.log(dataGroup);
    if (dataGroup) {
      console.log(dataGroup);
      setGroups(dataGroup.getGroups);
    }

    if (dataAmount) {
      console.log(dataAmount);
      fetchAmount(dataAmount.getAmount);
    }

    // fetchAmount(email.email);
  }, [dataInvite, dataGroup, dataAmount]);

  function fetchAmount(data) {
    let result = data.map((val) => {
      return { email: val.email, amt: val.amt };
    });
    console.log(result);
    // getAmount(email).then((result) => {
    let youOwe = [];
    let youOwed = [];
    if (result == null || result == 'undefined' || result == '') {
      result = [];
    }
    result.map((person) => {
      if (person.amt > 0) {
        youOwed.push(person);
      }
      if (person.amt < 0) {
        person.amt = person.amt * -1;
        youOwe.push(person);
      }
    });

    let youOweAccum = 0;
    let youOwedAccum = 0;
    for (let i = 0; i < youOwe.length; i++) {
      youOweAccum = youOweAccum + youOwe[i].amt;
    }

    for (let i = 0; i < youOwed.length; i++) {
      youOwedAccum = youOwedAccum + youOwed[i].amt;
    }
    setYouOwe(youOwe);
    setYouAreOwed(youOwed);
    setYouOweTotal(youOweAccum);
    setYouOwedTotal(youOwedAccum);
    setTotalBalance(youOwedAccum - youOweAccum);
    // });
  }

  const accept = (groupName, email, status) => {
    // acceptInvite(groupName, email).then((result) => {
    //   getInvites(email).then((result) => {
    //     setInvites(result);
    //     getGroups(email);
    //   });
    // });

    acceptInvite({
      variables: {
        groupName: groupName,
        email: email,
        status: status,
      },
    }).then((result) => {
      console.log(result);
      if (result.data.acceptInvite) {
        console.log('accepted invite');
      } else {
      }
    });
  };

  // function acceptInvite(groupName, email) {
  //   return new Promise((resolve, reject) => {
  //     Axios.post(endPointObj.url + 'inviteStatus', {
  //       status: true,
  //       groupName: groupName,
  //       email: email,
  //     })
  //       .then((response) => {
  //         // eslint-disable-next-line no-console
  //         console.log(response.data);
  //         resolve(response.data);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   });
  // }

  function getAmountforOwe(e) {
    let amountOwedList = owe.filter((list) => list.email == e.target.value);
    setAmount(amountOwedList[0].amt);
    setReciever(amountOwedList[0].email);
  }

  function getAmountforOwed(e) {
    console.log(e.target.value);

    let amountOwedList = owed.filter((list) => list.email == e.target.value);
    setAmount(amountOwedList[0].amt);
    setReciever(amountOwedList[0].email);
  }

  function getInvites(email) {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'invites/' + email)
        .then((response) => {
          // eslint-disable-next-line no-console
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  const settleUp = (sender, reciever, amount) => {
    return new Promise((resolve, reject) => {
      Axios.post(endPointObj.url + 'settleUp', {
        sender: sender,
        reciever: reciever,
        amount: amount,
      })
        .then((response) => {
          // eslint-disable-next-line no-console
          fetchAmount(queryString.parse(location.search).email);
          setShow(false);
          setShowOwed(false);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  function getAmount(email) {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'amount/v1/' + email)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  return (
    <div className="div-dashboard">
      {!Cookies.get('name') && <Redirect to="/login" />}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settle up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label data-testid="dashboard">Pay</Form.Label>
              <Form.Control as="select" onChange={getAmountforOwe}>
                <option selected disabled hidden>
                  Choose here
                </option>
                {owe.map((a) => (
                  <option key={a.email}>{a.email}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" placeholder={amount} disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => settleUp(queryString.parse(location.search).email, reciever, amount)}
          >
            Settle up
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOwed} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settle up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label data-testid="dashboard">Pay</Form.Label>
              <Form.Control as="select" onChange={getAmountforOwed}>
                <option selected disabled hidden>
                  Choose here
                </option>
                {owed.map((a) => (
                  <option key={a.email}>{a.email}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" placeholder={amount} disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => settleUp(reciever, queryString.parse(location.search).email, amount)}
          >
            Settle up
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="dashboard-layout-row">
        <VerticalNav groups={groups} />
        <Col xs={8} className="tiles">
          <Card bg="light" className="tiles">
            <Card.Header>
              <Row>
                <Col xs={10} data-testid="Dashboard">
                  Dashboard
                </Col>
                <Col>
                  <DropdownButton as={ButtonGroup} title="Settle up" id="bg-nested-dropdown">
                    <Dropdown.Item onClick={handleShow}>you owe</Dropdown.Item>
                    <Dropdown.Item onClick={handleShowOwed}>you owed</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Header>
          </Card>

          <Row>
            <Col className="total-balance">
              <Card bg="light">
                <Card.Header>total Balance {numeral(totalBalance).format()}</Card.Header>
              </Card>
            </Col>
            <Col className="you-owe">
              <Card bg="light">
                <Card.Header>You owe {numeral(youOwe).format()}</Card.Header>
              </Card>
            </Col>
            <Col className="you-are-owed">
              <Card bg="light">
                <Card.Header>You are owed {numeral(youOwed).format()}</Card.Header>
              </Card>
            </Col>
          </Row>

          <Row className="owe-owed">
            <Col className="owe-column">
              <div className="you-owe-title">You Owe</div>
              <ListGroup>
                {owe.map((a) => (
                  <ListGroup.Item key={a.email} className="links-dashboard-groups">
                    name:{a.email}&nbsp;&nbsp;&nbsp;amt:{numeral(a.amt).format()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col className="owed-column">
              <div className="you-owe-title">You Owed </div>
              <ListGroup>
                {owed.map((a) => (
                  <ListGroup.Item key={a.email} className="links-dashboard-groups">
                    name:{a.email}&nbsp;&nbsp;&nbsp;amt:{numeral(a.amt).format()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
        <Col className="nav-dashboard">
          {invites.map((member) => (
            <ListGroup>
              <ListGroup.Item key={member} className="links-dashboard-groups">
                {member.invitedby} has invitted you to join group {member.groupName}
                &nbsp;
                <i
                  class="fas fa-check-circle accept"
                  onClick={() => accept(member.groupName, member.email, 'true')}
                ></i>
                &nbsp;
                <i class="fas fa-times-circle reject"></i>
              </ListGroup.Item>
            </ListGroup>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
