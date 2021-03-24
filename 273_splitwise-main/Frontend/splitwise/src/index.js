/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

import allReducers from './reducers';

// eslint-disable-next-line no-undef
const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);
