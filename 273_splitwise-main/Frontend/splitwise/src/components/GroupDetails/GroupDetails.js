/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Jumbotron, Button } from 'react-bootstrap';
import Axios from 'axios';
const queryString = require('query-string');
import './GroupDetails.css';
import endPointObj from '../../endPointUrl';

function GroupDetails() {
  const [file, setFile] = useState('');
  const [group, setGroup] = useState('');
  const [image, setImage] = useState(endPointObj.url + 'leo.png');

  const getGroups = (group, email) => {
    Axios.get(endPointObj.url + 'getGroupPhoto/' + group + '/' + email)
      .then((result) => {
        // eslint-disable-next-line no-console
        setImage(endPointObj.url + result.data[0].groupPicture);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setGroup(queryString.parse(location.search).group);
    getGroups(queryString.parse(location.search).group, queryString.parse(location.search).email);
  }, []);

  function fileUpload() {
    const data = new FormData();
    data.append('name', 'file_name.jpg');
    data.append('file', file);
    Axios.post(
      endPointObj.url +
        'uploadGpPhoto/' +
        queryString.parse(location.search).group +
        '/' +
        queryString.parse(location.search).email,
      data
    )
      .then((res) => {
        console.log(res);
        getGroups(
          queryString.parse(location.search).group,
          queryString.parse(location.search).email
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fileChangehandler(event) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  return (
    <div className="layout-gp">
      <Row className="group-row">
        <Col xs={5}>
          <Row>
            <Image className="photo" src={image} rounded />
          </Row>
          <Row className="buttons-row">
            <input
              className="choose-file"
              type="file"
              id="file"
              accept=".jpg"
              onChange={(e) => fileChangehandler(e)}
            />
            <button onClick={() => fileUpload()}>upload</button>
          </Row>
        </Col>
        <Col>
          <Jumbotron className="display">
            <h1>Welcome to!!</h1>
            <h1>{group}</h1>
          </Jumbotron>
        </Col>
      </Row>
    </div>
  );
}

export default GroupDetails;
