import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import getStore from './getStore';
import App from './App';

const history = createHistory();
const store = getStore(history);

const fetchDataForLocation = location => {
  if (location.pathname === '/') {
    store.dispatch({ type: 'REQUEST_FETCH_QUESTIONS' });
  }
  
  if (location.pathname.includes('question')) {
    store.dispatch({ 
      type: 'REQUEST_FETCH_QUESTION', 
      questionId: location.pathname.split('/')[2] 
    });
  }
};

const render = Application => ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Application />
    </ConnectedRouter>
  </Provider>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    const nextApp = require('./App').default;

    render(nextApp);
  });
}

// render(App);
store.subscribe(() => {
  const state = store.getState();

  if (state.questions.length > 0) {
    render(App);
  }
});
fetchDataForLocation(history.location);
history.listen(fetchDataForLocation);
