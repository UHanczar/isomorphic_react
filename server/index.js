import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';
import path from 'path';
import { argv } from 'optimist';
import { get } from 'request-promise';
import { delay } from 'redux-saga';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import { questions, question } from '../data/api-real-url';
import getStore from '../src/getStore';
import App from '../src/App';

const PORT = process.env.PORT || 3000;
const app = express();
const useLiveData = argv.useLiveData === 'true';
const useServerRender = argv.useServerRender === 'true';

function* getQuestions() {
  let data;

  if (useLiveData) {
    data = yield get(questions, { gzip: true });
  } else {
    data = yield fs.readFile('./data/mock-questions.json', 'utf-8');
  }

  return JSON.parse(data);
}

function* getQuestion(id) {
  let data;

  if (useLiveData) {
    data = yield get(question(id), { gzip: true, json: true });
  } else {
    const questionsArray = yield getQuestions();

    const requiredQuestion = questionsArray.items.find(_question => _question.question_id.toString() === id);
    requiredQuestion.body = `Mock question body: ${id}`;
    data = { items: [requiredQuestion] };
  }

  return data;
}

app.get('/api/questions', function* (req, res) {
  const data = yield getQuestions();
  yield delay(150);

  res.json(data);
});

app.get('/api/question/:id', function* (req, res) {
  const data = yield getQuestion(req.params.id);
  yield delay(150);

  res.json(data);
});

if (process.env.NODE_ENV === 'development') {
  const config = require('../webpack.config.dev.babel').default;
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: true,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
}

app.get(['/', '/question/:id'], function* (req, res) {
  let index = yield fs.readFile('./public/index.html', 'utf-8');

  const initialState = {
    questions: []
  };

  const history = createHistory({
    initialEntries: [req.path]
  });
  
  if (req.params.id) {
    const questionId = req.params.id;
    const responce = yield getQuestion(questionId);
    const questionDetails = responce.items[0];
    initialState.questions = [{ ...questionDetails, questionId }];
  } else {
    const fetchedQuestions = yield getQuestions();
    initialState.questions = fetchedQuestions.items;
  }
  
  const store = getStore(history, initialState);

  if (useServerRender) {
    const appRendered = renderToString(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );

    index = index.replace('<%= preloadApplication %>', appRendered);
  } else {
    index = index.replace('<%= preloadApplication %>', 'Pleace, wait while we load the application.');
  }

  res.send(index);
});

app.listen(PORT, '0.0.0.0', () => console.info(`Server runs on port ${PORT}`));
