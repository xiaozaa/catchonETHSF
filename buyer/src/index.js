import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { init } from './top';


const createDOMElement = () => {
  const body = document.getElementsByTagName('body')[0];
  const div = Object.assign(document.createElement('div'), {
    id: "root",
  });
  body.appendChild(div);
  return div;
}

export const renderAppContainer = () => {
  ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, createDOMElement());
}

document.addEventListener("DOMContentLoaded", () => {
  renderAppContainer();
  init();
});

reportWebVitals();
