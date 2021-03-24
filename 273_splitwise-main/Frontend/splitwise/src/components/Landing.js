/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import './Landing.css';

function landing() {
  return (
    <div className="landing-page">
      <Jumbotron>
        <h1>Welcome to Splitwise!</h1>
      </Jumbotron>
    </div>
  );
}

export default landing;
