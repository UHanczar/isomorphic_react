import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';
import { argv } from 'optimist';
import { get } from 'request-promise';
import { delay } from 'redux-saga';

import { questions, question } from '../data/api-real-url';

const PORT = process.env.PORT || 3000;
const app = express();
const useLiveData = argv.useLiveData === 'true';

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
    console.log('DATA', data);
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
}

app.get(['/'], function* (req, res) {
  const index = yield fs.readFile('./public/index.html', 'utf-8');

  res.send(index);
});

app.listen(PORT, '0.0.0.0', () => console.info(`Server runs on port ${PORT}`));
