/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import VerticalNav from '../VerticalNav/VerticalNav';
import {
  Nav,
  Row,
  Col,
  Button,
  Card,
  Container,
  ListGroup,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Modal,
  Form,
} from 'react-bootstrap';
import './RecentActivity.css';
const queryString = require('query-string');
import Axios from 'axios';
import 'numeral/locales/en-gb';
import endPointObj from '../../endPointUrl';
import ReactPaginate from 'react-paginate';
import { useStore } from 'react-redux';

var numeral = require('numeral');

function recentActivity() {
  const [groups, setGroups] = useState([]);
  const [activity, setActivity] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [enteriesPerPage, setEnteriesPerPage] = useState(2);
  const [pageCountState, setPageCountState] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [filter, setFilter] = useState('');
  const [timestampOrder, setTimeStampOrder] = useState('dscending');
  // const [entries, setEntriesState] = useState(2);

  let pageCount = 0;
  const pagesVisited = pageNumber * enteriesPerPage;

  const setEntries = (length, items) => {
    const parsed = queryString.parse(location.search);
    // getRecentActivity(parsed.email, 5);
    pageCount = Math.ceil(length / items);
    setEnteriesPerPage(items);
    setPageCountState(pageCount);
    setItemsPerPage(items);
    setPageNumber(0);
  };

  console.log(activity);
  let array = activity;
  console.log(array);

  let displayUsers = activity.slice(pagesVisited, pagesVisited + enteriesPerPage).map((act) => {
    return (
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
    );
  });

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

  const getRecentActivity = (email, filter, timestampOrder, enteriesPerPage) => {
    console.log(pagesVisited, pagesVisited + enteriesPerPage);
    Axios.get(endPointObj.url + 'Activity/' + email, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        numeral.reset();
        numeral.defaultFormat('$0,0.00');

        setEnteriesPerPage(enteriesPerPage);

        numeral.locale(sessionStorage.getItem('currency'));
        if (filter !== '') {
          console.log(filter);
          response.data = response.data.filter((gp) => gp.groupName === filter);
        }

        console.log(response.data);
        pageCount = Math.ceil(response.data.length / enteriesPerPage);
        setPageCountState(pageCount);
        if (timestampOrder == 'dscending') {
          response.data.sort((a, b) => {
            // console.log(a.timestamp, b.timestamp);
            // console.log(a.timestamp < b.timestamp);
            return a.timestamp < b.timestamp ? 1 : -1;
          });
        } else {
          response.data.sort((a, b) => {
            // console.log(a.timestamp, b.timestamp);
            // console.log(a.timestamp < b.timestamp);
            return a.timestamp > b.timestamp ? 1 : -1;
          });
        }
        //
        console.log(filter);

        // response.data = sort(response.data, 'ascending');
        setActivity(response.data);
        console.log(response.data);
        setPageNumber(0);
        console.log(activity);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const sort = (data, type) => {
  //   if (type === 'ascending') {
  //     data.sort((a, b) => {
  //       // console.log(a.timestamp, b.timestamp);
  //       // console.log(a.timestamp < b.timestamp);
  //       return a.timestamp < b.timestamp ? 1 : -1;
  //     });
  //     console.log(data);
  //     setActivity(data);
  //   } else {
  //     console.log('dscending');
  //     console.log(data);
  //     let newData = data.sort((a, b) => {
  //       // console.log(a.timestamp, b.timestamp);
  //       // console.log(a.timestamp < b.timestamp);
  //       return a.timestamp > b.timestamp ? 1 : -1;
  //     });
  //     console.log(newData);

  //     setActivity(newData);
  //   }
  // };

  let changePage = ({ selected }) => {
    console.log(selected);
    setPageNumber(selected);
  };

  let filterByGp = (act, group) => {
    setFilter(group);
    // setItemsPerPage(items);
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    getGroups(parsed.email);

    getRecentActivity(parsed.email, '', 'dscending', 2);
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
                <Col>
                  <DropdownButton
                    as={ButtonGroup}
                    title={'Entries Per Page: ' + itemsPerPage}
                    id="bg-nested-dropdown"
                  >
                    <Dropdown.Item
                      onClick={() => {
                        setEntries(activity.length, 2);
                      }}
                    >
                      2
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setEntries(activity.length, 5);
                      }}
                    >
                      5
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setEntries(activity.length, 10);
                      }}
                    >
                      10
                    </Dropdown.Item>
                  </DropdownButton>
                  &nbsp;&nbsp;
                  <DropdownButton
                    as={ButtonGroup}
                    title={'Sort ' + timestampOrder}
                    id="bg-nested-dropdown"
                  >
                    <Dropdown.Item
                      onClick={() => {
                        const parsed = queryString.parse(location.search);
                        setTimeStampOrder('ascending');
                        getRecentActivity(parsed.email, filter, 'ascending', enteriesPerPage);
                      }}
                    >
                      ascending
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        const parsed = queryString.parse(location.search);
                        setTimeStampOrder('dscending');
                        getRecentActivity(parsed.email, filter, 'dscending', enteriesPerPage);
                      }}
                    >
                      dscending
                    </Dropdown.Item>
                  </DropdownButton>
                  &nbsp;&nbsp;
                  <DropdownButton
                    as={ButtonGroup}
                    title={'filter: ' + filter}
                    id="bg-nested-dropdown"
                  >
                    <Dropdown.Item
                      onClick={() => {
                        const parsed = queryString.parse(location.search);

                        getRecentActivity(parsed.email, '', timestampOrder, enteriesPerPage);
                      }}
                    >
                      Clear Filter
                    </Dropdown.Item>
                    {groups.map((gp) => (
                      <Dropdown.Item
                        onClick={() => {
                          const parsed = queryString.parse(location.search);
                          setFilter(gp.groupName);
                          getRecentActivity(
                            parsed.email,
                            gp.groupName,
                            timestampOrder,
                            enteriesPerPage
                          );
                        }}
                      >
                        {gp.groupName}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Header>
          </Card>
          <Row>
            {' '}
            <div className="scroll">
              <ListGroup className="list-recent-activity">{displayUsers}</ListGroup>
            </div>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                pageCount={pageCountState}
                onPageChange={changePage}
                containerClassName={'paginationBttns'}
                previousLinkClassName={'previousBttn'}
                nextLinkClassName={'nextBttn'}
                disabledClassName={'paginationDisabled'}
                activeClassName={'paginationActive'}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default recentActivity;
