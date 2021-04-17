/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import VerticalNav from '../VerticalNav/VerticalNav';
import { Nav, Row, Col, Button, Card, Container, ListGroup, Modal, Form } from 'react-bootstrap';
import './RecentActivity.css';
const queryString = require('query-string');
import Axios from 'axios';
import 'numeral/locales/en-gb';
import endPointObj from '../../endPointUrl';
import Pagination from 'react-js-pagination';

var numeral = require('numeral');

function recentActivity() {
  const [groups, setGroups] = useState([]);
  const [activity, setActivity] = useState([]);
  const [pageNumber, setPage] = useState(0);

  const getGroups = (email) => {
    Axios.get(endPointObj.url + 'getGroups/' + email, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        setGroups(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setPage(pageNumber);
  };

  const getRecentActivity = (email) => {
    Axios.get(endPointObj.url + 'Activity/' + email, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        numeral.reset();
        numeral.defaultFormat('$0,0.00');

        numeral.locale(sessionStorage.getItem('currency'));

        console.log(response.data);
        response.data.sort((a, b) => {
          // console.log(a.timestamp, b.timestamp);
          // console.log(a.timestamp < b.timestamp);
          return a.timestamp < b.timestamp ? 1 : -1;
        });
        console.log(response.data);
        setActivity(response.data);

        console.log(activity);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    getGroups(parsed.email);
    getRecentActivity(parsed.email);
  }, []);
  return (
    <div className="groupLayout">
      <Row>
        <VerticalNav groups={groups} />

        <Col className="recent-activity-heading">
          <Card bg="light" className="tiles-groups">
            <Card.Header>
              <Row>
                <Col>Recent Activity</Col>
              </Row>
            </Card.Header>
          </Card>
          <Row>
            {' '}
            <div className="scroll">
              <ListGroup className="list-recent-activity">
                {activity.map((act) => (
                  <ListGroup.Item key={act.activity} className="links-dashboard-groups">
                    {act.activityType === 'invited' && (
                      <p>
                        {act.invitedby} invited {act.members} to group {act.groupName}
                      </p>
                    )}
                    {act.activityType === 'creator' && (
                      <p>
                        {act.createdBy} created group {act.groupName}
                      </p>
                    )}
                    {act.activityType === 'Bill' && (
                      <p>
                        {act.createdBy} added Bill of {act.amount} to group {act.groupName}
                      </p>
                    )}
                    {act.activityType === 'acceptedInvite' && (
                      <p>
                        {act.members} accepted invite for {act.groupName}
                      </p>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default recentActivity;
