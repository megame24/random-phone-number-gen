const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

const port = process.env.PORT || 3005;

require('dotenv').config();

if (!isProduction) {
  app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Mega-shirts API' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`); // eslint-disable-line
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line
  // log errors only on dev environment
  if (process.env.NODE_ENV === 'development') {
    console.log(err.stack); // eslint-disable-line
  }
  if (err.status) {
    return res.status(err.status)
      .json({
        error: {
          status: err.status,
          message: err.message
        },
      });
  }
  return res.status(500).json({
    error: {
      status: 500,
      message: 'Internal server error'
    }
  });
});

module.exports = app;
