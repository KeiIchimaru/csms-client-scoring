import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import store from './redux/store'

import { transitions, positions, types, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// React CSS
import styles from "../css/style.css";

// optional cofiguration
const options = {
  position: positions.TOP_CENTER,
  timeout: 1500,
  offset: '30px',
  type: types.INFO,
  transition: transitions.FADE
}

ReactDom.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('content')
);
