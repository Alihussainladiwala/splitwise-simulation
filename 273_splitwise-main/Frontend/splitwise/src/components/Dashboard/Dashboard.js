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
import { useDispatch, useSelector } from 'react-redux';

var numeral = require('numeral');

function Dashboard() {
  const [show, setShow] = useState(false);
  const [showOwed, setShowOwed] = useState(false);

  const email = useSelector((state) => state.login.username);

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

  const getGroups = () => {
    Axios.get(endPointObj.url + 'getGroups/' + email, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response);
        setGroups(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // if (Cookies.get('userId')) {
    //   console.log('loaded cookie');
    // }
    numeral.reset();
    numeral.defaultFormat('$0,0.00');

    numeral.locale(sessionStorage.getItem('currency'));

    // const parsed = queryString.parse(location.search);
    // let email = parsed;
    getGroups();

    getInvites().then((result) => {
      setInvites(result);
    });

    fetchAmount();
  }, []);

  function fetchAmount() {
    getAmount(email).then((result) => {
      let youOwe = [];
      let youOwed = [];
      if (result == null || result == 'undefined' || result == '') {
        result = [];
      }
      result.map((person) => {
        if (person.amount > 0) {
          youOwed.push(person);
        }
        if (person.amount < 0) {
          person.amount = person.amount * -1;
          youOwe.push(person);
        }
      });

      let youOweAccum = 0;
      let youOwedAccum = 0;
      for (let i = 0; i < youOwe.length; i++) {
        youOweAccum = youOweAccum + youOwe[i].amount;
      }

      for (let i = 0; i < youOwed.length; i++) {
        youOwedAccum = youOwedAccum + youOwed[i].amount;
      }
      setYouOwe(youOwe);
      setYouAreOwed(youOwed);
      setYouOweTotal(youOweAccum);
      setYouOwedTotal(youOwedAccum);
      setTotalBalance(youOwedAccum - youOweAccum);
    });
  }

  const accept = (groupName, email) => {
    acceptInvite(groupName, email).then((result) => {
      getInvites(email).then((result) => {
        setInvites(result);
        getGroups(email);
      });
    });
  };

  function acceptInvite(groupName) {
    return new Promise((resolve, reject) => {
      Axios.post(
        endPointObj.url + 'inviteStatus',
        {
          status: true,
          groupName: groupName,
          email: email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
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

  function getAmountforOwe(e) {
    console.log(owe);
    let amountOwedList = owe.filter((list) => list.email == e.target.value);
    setAmount(amountOwedList[0].amount);
    setReciever(amountOwedList[0].email);
  }

  function getAmountforOwed(e) {
    console.log(e.target.value);
    console.log(owed);
    let amountOwedList = owed.filter((list) => list.email == e.target.value);
    setAmount(amountOwedList[0].amount);
    setReciever(amountOwedList[0].email);
  }

  function getInvites() {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'invites/' + email, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
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
      Axios.post(
        endPointObj.url + 'settleUp',
        {
          sender: sender,
          reciever: reciever,
          amount: amount,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
        .then((response) => {
          // eslint-disable-next-line no-console
          fetchAmount(email);
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
      Axios.get(endPointObj.url + 'amount/' + email, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settle up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Pay</Form.Label>
              <Form.Control as="select" onChange={getAmountforOwe}>
                <option selected disabled hidden>
                  Choose here
                </option>
                {owe.map((a) => (
                  <option key={a.email} value={a.email}>
                    {a.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" placeholder={numeral(amount).format()} disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => settleUp(email, reciever, amount)}>
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
              <Form.Label>Pay</Form.Label>
              <Form.Control as="select" onChange={getAmountforOwed}>
                <option selected disabled hidden>
                  Choose here
                </option>
                {owed.map((a) => (
                  <option key={a.email} value={a.email}>
                    {a.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" placeholder={numeral(amount).format()} disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => settleUp(reciever, email, amount)}>
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
                  <ListGroup.Item key={a.name} className="links-dashboard-groups">
                    name:{a.name}&nbsp;&nbsp;&nbsp;amt:{numeral(a.amount).format()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col className="owed-column">
              <div className="you-owe-title">You Owed </div>
              <ListGroup>
                {owed.map((a) => (
                  <ListGroup.Item key={a.name} className="links-dashboard-groups">
                    name:{a.name}&nbsp;&nbsp;&nbsp;amt:{numeral(a.amount).format()}
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
                  onClick={() => accept(member.groupName, member.name)}
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
