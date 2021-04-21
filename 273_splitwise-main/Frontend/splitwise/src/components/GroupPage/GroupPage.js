/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState, useContext, callback } from 'react';
import VerticalNav from '../VerticalNav/VerticalNav';
import { useDispatch, useSelector } from 'react-redux';
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
  Accordion,
  AccordionContext,
  useAccordionToggle,
} from 'react-bootstrap';
import Axios from 'axios';
import SideBar from '../SideBar/SideBar';
import './GroupPage.css';
const queryString = require('query-string');
import { useLocation, Switch } from 'react-router-dom';
import 'numeral/locales/en-gb';
var numeral = require('numeral');
import endPointObj from '../../endPointUrl';

function GroupPage() {
  const [show, setShow] = useState(false);
  const [inconText, iconClass] = useState('fas fa-angle-right');
  const history = useHistory();
  const [showExit, setShowExit] = useState(false);
  const [groups, setGroups] = useState([]);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [billsLength, noOfBills] = useState(0);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showExitGroupModal, ExitGroupModal] = useState(false);
  const [exitStatus, setExitStatus] = useState(false);
  const [note, setNote] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [userId, setUserID] = useState(null);
  const [billId, setBillID] = useState(null);
  const [noteId, setNoteID] = useState(null);

  const [bills, setBills] = useState([]);
  const [members, setMembers] = useState([]);
  const [id, setId] = useState('');
  const location = useLocation();

  const handleClose = () => {
    setShowExit(false);
    setShow(false);
  };

  const email = useSelector((state) => state.login.username);
  const group = useSelector((state) => state.login.groupName);
  const handleCloseDelete = () => setShowDelete(false);

  const handleShowDelete = (userIdBill, billIdBill, noteIdBill) => {
    setUserID(userIdBill);
    setBillID(billIdBill);
    setNoteID(noteIdBill);
    setShowDelete(true);
  };

  const handleSaveChanges = () => {
    const parsed = queryString.parse(location.search);
    AddBill(parsed.email, parsed.group);
  };

  const AddBill = () => {
    Axios.post(
      endPointObj.url + 'addBill',
      {
        user: email,
        billData: description,
        amount: amount,
        group: group,
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {
        // eslint-disable-next-line no-console
        fetchBills(group).then((result) => {
          console.log(result);
          setBills([]);
          setBills(result);
        });
        getGroupMembers(email, group).then((result) => {
          setMembers([]);
          setMembers(result);

          if (result.length == 0) {
            setExitStatus(true);
          } else {
            setExitStatus(false);
          }
        });

        setShow(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleShow = () => {
    setShow(true);
  };

  const exitGroup = () => {
    setShowExit(true);
  };

  const getUserId = () => {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'userId/' + email, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }).then((response) => {
        console.log(response.data.id, 'got user id');
        resolve(response.data.id);
      });
    });
  };

  useEffect(() => {
    Axios.get(endPointObj.url + 'getGroups/' + email, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        // eslint-disable-next-line no-console
        setGroups(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    fetchBills(group).then((result) => {
      setBills([]);
      if (result != undefined && result != '' && result != null) {
        numeral.locale(sessionStorage.getItem('currency'));
        numeral.defaultFormat('$0,0.00');
        setBills(result);
      }

      getUserId().then((id) => {
        console.log(id, 'got the id');
        setId(id);
      });

      noOfBills(result.length);
    });

    getGroupMembers(email, group).then((result) => {
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
  }, [location]);

  function fetchBills() {
    return new Promise((resolve, reject) => {
      console.log(group);
      Axios.get(endPointObj.url + 'fetchBills/' + group, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
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

  function getGroupMembers() {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'groupAmount/' + email + '/' + group, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then((response) => {
          // eslint-disable-next-line no-console
          response.data = response.data.filter((data) => data.amount != 0);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  function exitGroupCall() {
    return new Promise((resolve, reject) => {
      Axios.post(
        endPointObj.url + 'exitGroup/' + email + '/' + group,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
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

  function CustomToggle({ children, eventKey }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <i
        onClick={decoratedOnClick}
        class={isCurrentEventKey ? 'fas fa-angle-down' : 'fas fa-angle-right'}
      >
        {children}
      </i>
    );
  }

  const addNote = (billId, note) => {
    Axios.post(
      endPointObj.url + 'addNotes/' + billId,
      {
        note: note,
        email,
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    ).then((response) => {
      console.log('now fetch bills');
      fetchBills(group).then((result) => {
        console.log(result);
        setBills([]);
        setBills(result);
      });
    });
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  };

  const deleteNote = () => {
    console.log(id);
    console.log(userId);
    if (id === userId) {
      console.log(id, 'attempting to delete note');
      Axios.post(
        endPointObj.url + 'deleteNote/' + billId,
        {
          noteId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      ).then(() => {
        fetchBills(group).then((result) => {
          console.log(result);
          setShowDelete(false);
          setBills([]);
          setBills(result);
        });
      });
    }
  };

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

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete note?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteNote();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

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
              <Accordion>
                {bills.map((bill) => (
                  <Card>
                    <Card.Header>
                      <CustomToggle eventKey={JSON.stringify(bills.indexOf(bill))}></CustomToggle>
                      amt:{numeral(bill.amount).format()}&nbsp;&nbsp;sender:{bill.sender}
                      &nbsp;&nbsp;
                    </Card.Header>
                    <Accordion.Collapse eventKey={JSON.stringify(bills.indexOf(bill))}>
                      <Card.Body>
                        <ListGroup as="ul">
                          {bill.notes.map((note) => (
                            <ListGroup.Item>
                              <Row>
                                <Col sm={11}>{note.note}</Col>
                                <Col>
                                  <i
                                    onClick={() => {
                                      handleShowDelete(note.userId, bill._id, note._id);
                                    }}
                                    class={
                                      note.userId === id
                                        ? 'far fa-trash-alt'
                                        : 'gp-trash-can-disabled far fa-trash-alt'
                                    }
                                  ></i>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          ))}

                          <ListGroup.Item>
                            <Row>
                              <Col sm={11}>
                                <Form.Control
                                  type="text"
                                  placeholder="Normal text"
                                  onChange={(e) => onChangeNote(e)}
                                />
                              </Col>
                              <Col>
                                <i
                                  class="fas fa-plus"
                                  onClick={() => {
                                    addNote(bill._id, note);
                                  }}
                                ></i>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))}
              </Accordion>
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
