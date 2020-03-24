import './lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

// app imports
import Main from 'Main';
import configureStore, { history } from 'State/configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}><ConnectedRouter history={history}><Main /></ConnectedRouter></Provider>,
  document.getElementById('main'),
);
