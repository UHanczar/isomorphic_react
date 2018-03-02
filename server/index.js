import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';

const PORT = process.env.PORT || 3000;
const app = express();

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
