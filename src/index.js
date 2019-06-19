import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';
import 'react-vis/dist/style.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
