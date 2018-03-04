import { createStore, combineReducers, applyMiddleware } from 'redux';
import { identity } from 'lodash';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { routerReducer as router, routerMiddleware } from 'react-router-redux';

import fetchQuestionsSaga from './sagas/fetchQuestionsSaga';
import fetchQuestionSaga from './sagas/fetchQuestionSaga';
import * as reducers from './reducers';

export default (history, defaultState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = routerMiddleware(history);
  const middlewareChain = [middleware, sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewareChain.push(logger);
  }

  const store = createStore(combineReducers({ ...reducers, router }), defaultState, applyMiddleware(...middlewareChain));
  sagaMiddleware.run(fetchQuestionsSaga);
  sagaMiddleware.run(fetchQuestionSaga);

  return store;
};
