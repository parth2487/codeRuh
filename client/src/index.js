import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
<GoogleOAuthProvider clientId="469933567589-84ncrl6ad8iqljaa2ifvl0q4q717ir07.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>;  
  </Router>
);


reportWebVitals();
