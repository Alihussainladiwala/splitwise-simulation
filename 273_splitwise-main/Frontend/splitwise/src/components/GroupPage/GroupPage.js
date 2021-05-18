/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import VerticalNav from '../VerticalNav/VerticalNav';
import { useHistory } from 'react-router-dom';
import {
  Nav,
  Row,
  Col,
  Button,
  Card,
  Container,
  ListGroup,
  Modal,
  Form,
  DropdownButton,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import Axios from 'axios';
import SideBar from '../SideBar/SideBar';
import './GroupPage.css';
const queryString = require('query-string');
import { useLocation, Switch } from 'react-router-dom';
import 'numeral/locales/en-gb';
var numeral = require('numeral');
import endPointObj from '../../endPointUrl';
import { addBillRequest } from '../../GraphQL/Mutations';
import { fetchBillsRequest } from '../../GraphQL/Query';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';

function GroupPage() {
  const location = useLocation();
  const { error, loading, data } = useQuery(fetchBillsRequest, {
    variables: { group: queryString.parse(location.search).group },
  });
  const [addBill, { errorBill }] = useMutation(addBillRequest);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const [showExit, setShowExit] = useState(false);
  const [groups, setGroups] = useState([]);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [billsLength, noOfBills] = useState(0);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showExitGroupModal, ExitGroupModal] = useState(false);
  const [exitStatus, setExitStatus] = useState(false);

  const [bills, setBills] = useState([]);
  const [members, setMembers] = useState([]);

  const handleClose = () => {
    setShowExit(false);
    setShow(false);
  };

  const handleSaveChanges = () => {
    const parsed = queryString.parse(location.search);
    AddBill(parsed.email, parsed.group);
  };

  const AddBill = (email, group) => {
    addBill({
      variables: {
        amount: amount,
        billData: description,
        user: email,
        group: group,
      },
    }).then((result) => {
      console.log(result);
      if (result.data.signUp && result.data.addBill.message.toLowerCase()) {
        console.log('successfully added bill');
      } else {
        console.log('failed to add bill');
      }
    });

    // Axios.post(endPointObj.url + 'addBill', {
    //   user: email,
    //   billData: description,
    //   amount: amount,
    //   group: group,
    // })
    //   .then((response) => {
    //     // eslint-disable-next-line no-console
    //     fetchBills(group).then((result) => {
    //       console.log(result);
    //       setBills([]);
    //       setBills(result);
    //     });
    //     getGroupMembers(email, group).then((result) => {
    //       setMembers([]);
    //       setMembers(result);

    //       if (result.length == 0) {
    //         setExitStatus(true);
    //       } else {
    //         setExitStatus(false);
    //       }
    //     });

    //     setShow(false);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  const handleShow = () => {
    setShow(true);
  };

  const exitGroup = () => {
    setShowExit(true);
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    let group = parsed;
    Axios.get(endPointObj.url + 'groups/' + group.email)
      .then((response) => {
        // eslint-disable-next-line no-console
        setGroups(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    console.log(data);

    // fetchBills(group.group).then((result) => {
    //   setBills([]);
    //   if (result != undefined && result != '' && result != null) {
    //     numeral.locale(sessionStorage.getItem('currency'));
    //     numeral.defaultFormat('$0,0.00');
    //     setBills(result);
    //   }

    //   noOfBills(result.length);
    // });

    getGroupMembers(group.email, group.group).then((result) => {
      setMembers([]);
      setMembers(result);

      //let ans = result.filter((member) => member.amt < 0);
      //console.log(ans);

      if (result.length == 0) {
        setExitStatus(true);
      } else {
        setExitStatus(false);
      }
    });
  }, [location, data]);

  function fetchBills(group) {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'fetchBills/' + group)
        .then((response) => {
          noOfBills(response.data.length);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  const handleClickDashboard = () => {
    history.push({
      pathname: '/dashboard',
      search: '?email=' + queryString.parse(location.search).email,
    });
  };

  const handleClickGpDetails = () => {
    history.push({
      pathname: '/gpDetails',
      search:
        '?group=' +
        queryString.parse(location.search).group +
        '&email=' +
        queryString.parse(location.search).email,
    });
  };

  function getGroupMembers(email, group) {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'amt/' + email + '/' + group)
        .then((response) => {
          // eslint-disable-next-line no-console
          response.data = response.data.filter((data) => data.amt != 0);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  function exitGroupCall(email, groupName) {
    return new Promise((resolve, reject) => {
      Axios.post(endPointObj.url + 'exitGroup', {
        status: true,
        groupName: groupName,
        email: email,
      })
        .then((response) => {
          // eslint-disable-next-line no-console
          setShowExit(false);
          handleClickDashboard();

          // resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter amount"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {exitStatus && (
        <Modal show={showExit} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>Exit Group?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() =>
                exitGroupCall(
                  queryString.parse(location.search).email,
                  queryString.parse(location.search).group
                )
              }
            >
              Yes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {!exitStatus && (
        <Modal show={showExit} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Cannot exit group</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Row className="group-layout-row">
        <VerticalNav groups={groups} />

        <Col xs={8} className="tiles-groups">
          <Card bg="light" className="tiles-groups">
            <Card.Header>
              <Row>
                <Col xs={9}>{queryString.parse(location.search).group}</Col>
                <Col>
                  <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-nested-dropdown">
                    <Dropdown.Item onClick={handleShow}>Add Bill</Dropdown.Item>
                    <Dropdown.Item onClick={exitGroup}>Exit Group</Dropdown.Item>
                    <Dropdown.Item onClick={handleClickGpDetails}>Group Detials</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Header>
          </Card>
          <Row>
            <Col>
              {billsLength == 0 && <p className="no-bills">No bills!</p>}
              <ListGroup>
                {bills.map((bill) => (
                  <ListGroup.Item key={bill.amount} className="links-dashboard-groups">
                    amt:{numeral(bill.amount).format()}&nbsp;&nbsp;sender:{bill.sender}
                    &nbsp;&nbsp;&nbsp;description: {bill.billData}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
        <Col className="side-bar">
          <SideBar members={members} Dashboard={false} numeral={numeral} />
        </Col>
      </Row>
    </div>
  );
}

export default GroupPage;
