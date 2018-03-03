import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import getStore from './getStore';

const store = getStore();
const fetchDataForLocation = () => store.dispatch({ type: 'REQUEST_FETCH_QUESTIONS'});

import App from './App';

const render = Application => ReactDOM.render(
<Provider store={store}>
  <Application />
</Provider>, document.getElementById('root'));

render(App);
fetchDataForLocation();
