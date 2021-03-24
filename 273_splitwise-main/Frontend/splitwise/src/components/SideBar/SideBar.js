/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { ListGroup, Button, Nav } from 'react-bootstrap';
const queryString = require('query-string');
import Axios from 'axios';
import endPointObj from '../../endPointUrl';

function SideBar(props) {
  const [invites, setInvites] = useState([]);

  const parsed = queryString.parse(location.search);
  let email = parsed;

  useEffect(() => {
    if (props.Dashboard) {
      getInvites(email.email).then((result) => {
        setInvites(result);
      });
    }
  }, []);

  const accept = (groupName, email) => {
    acceptInvite(groupName, email).then((result) => {
      getInvites(email).then((result) => {
        setInvites(result);
      });
    });
  };

  function getInvites(email) {
    return new Promise((resolve, reject) => {
      Axios.get(endPointObj.url + 'invites/' + email)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  function acceptInvite(groupName, email) {
    return new Promise((resolve, reject) => {
      Axios.post(endPointObj.url + 'inviteStatus', {
        status: true,
        groupName: groupName,
        email: email,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  return (
    <div>
      {' '}
      {!props.Dashboard &&
        props.members.map((member) =>
          member.amt < 0 ? (
            <ul key={member.amt} data-testid="Member" className="links-dashboard-groups">
              you owe {member.email}&nbsp;amt:{props.numeral(member.amt * -1).format()}
            </ul>
          ) : (
            <ul key={member.amt} data-testid="Member" className="links-dashboard-groups">
              {member.email} owes you &nbsp;amt:{props.numeral(member.amt).format()}
            </ul>
          )
        )}
      {props.members.length == 0 && <p>you are all cleard up!</p>}
      {props.Dashboard &&
        invites.map((member) => (
          <ListGroup>
            <ListGroup.Item key={member} className="links-dashboard-groups">
              {member.invitedby} has invitted you to join group {member.groupName}
              &nbsp;
              <i
                class="fas fa-check-circle accept"
                onClick={() => accept(member.groupName, member.email)}
              ></i>
              &nbsp;
              <i class="fas fa-times-circle reject"></i>
            </ListGroup.Item>
          </ListGroup>
        ))}
    </div>
  );
}

SideBar.defaultProps = {
  groups: [],
  members: [],
  Dashboard: false,
};

export default SideBar;
