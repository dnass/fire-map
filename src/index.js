import React from 'react';
import ReactDOM from 'react-dom';
import GA4React from 'ga-4-react';
import App from './App';
import './index.css';

new GA4React('G-SBVCST147G').initialize();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
