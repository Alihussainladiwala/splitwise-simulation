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

var numeral = require('numeral');

function recentActivity() {
  const [groups, setGroups] = useState([]);
  const [activity, setActivity] = useState([]);

  const getGroups = (email) => {
    Axios.get(endPointObj.url + 'groups/' + email)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getRecentActivity = (email) => {
    Axios.get(endPointObj.url + 'Activity/' + email)
      .then((response) => {
        numeral.reset();
        numeral.defaultFormat('$0,0.00');

        numeral.locale(sessionStorage.getItem('currency'));

        response.data.activity.sort((a, b) => {
          return a.timestamp < b.timestamp ? 1 : -1;
        });
        setActivity(response.data.activity);

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
                    {act.activity == 'inivite' ? (
                      <p>
                        {act.invitedby} invited {act.invited} to group {act.gp}
                      </p>
                    ) : (
                      <p>
                        {act.sender} added a bill of {numeral(act.amount).format()} to group{' '}
                        {act.gp}
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
