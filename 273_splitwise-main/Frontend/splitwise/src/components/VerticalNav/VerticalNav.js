/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useState } from 'react';
import { Nav, Row, Col, Image } from 'react-bootstrap';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import './VerticalNav.css';
import endPointObj from '../../endPointUrl';
import { setUser } from '../../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const queryString = require('query-string');

function VerticalNav(props) {
  const history = useHistory();
  const [displayList, setDisplayList] = useState([]);
  const [onChangeTriggered, setOnChangeTriggerd] = useState(false);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.login.username);
  const emailId = email;

  const handleClick = () => {
    history.push({
      pathname: '/addGroups',
      search: '?email=' + emailId,
    });
  };

  const handleClickGroup = (path) => {
    dispatch(setUser(email, true, path));
    history.push({
      pathname: '/groupPage',
    });
  };

  const handleClickRecentActivity = () => {
    history.push({
      pathname: '/recent',
      search: '?email=' + emailId,
    });
  };

  const handleClickDashboard = () => {
    history.push({
      pathname: '/dashboard',
      search: '?email=' + emailId,
    });
  };

  const onGroupAdd = () => {
    handleClick();
  };

  const dashboard = () => {
    handleClickDashboard();
  };

  const recentActivity = () => {
    handleClickRecentActivity();
  };

  const groupPage = (group) => {
    handleClickGroup(group);
  };

  const onChange = (opt, list) => {
    if (opt == null || opt == 'undefined') {
      opt = '';
    }

    setOnChangeTriggerd(true);

    let final_list = list.filter((li) => {
      return li.groupName.includes(opt.target.value);
    });
    setDisplayList(final_list);
  };

  return (
    <div className="nav-dashboard">
      <Col className="nav-dashboard">
        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link onClick={dashboard} className="button-dashboard-dashboard">
            Dashboard
          </Nav.Link>
          <Nav.Link onClick={recentActivity} className="button-dashboard-recent-activity">
            Recent Activity
          </Nav.Link>
          <Nav.Link
            onClick={() => onGroupAdd()}
            variant="secondary"
            className="button-dashboard-groups"
          >
            Groups +
          </Nav.Link>
          <div className="groups-list">
            <input
              className="input-search"
              type="text"
              placeholder=". . . search"
              onChange={(opt) => onChange(opt, props.groups)}
            />
            {onChangeTriggered == true &&
              displayList.map((group) => (
                <Row>
                  <img src={endPointObj.url + group.photo} className="group-image"></img>
                  <Nav.Link
                    data-testid="Group"
                    key={group.groupName}
                    onClick={() => groupPage(group.groupName)}
                    className="links-dashboard-groups"
                  >
                    {group.groupName}
                  </Nav.Link>
                </Row>
              ))}
            {onChangeTriggered == false &&
              props.groups.map((group) => (
                <Row>
                  <img src={endPointObj.url + group.photo} className="group-image"></img>
                  <Nav.Link
                    data-testid="Group"
                    key={group.groupName}
                    onClick={() => groupPage(group.groupName)}
                    className="links-dashboard-groups"
                  >
                    {group.groupName}
                  </Nav.Link>
                </Row>
              ))}
          </div>
          <Nav.Link eventKey="disabled" disabled>
            Friends
          </Nav.Link>
        </Nav>
      </Col>
    </div>
  );
}

VerticalNav.defaultProps = {
  groups: [],
};

export default VerticalNav;
