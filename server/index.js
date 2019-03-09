const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const compression = require('compression');
const morgan = require('morgan');

const keys = require('../config/keys');

// Routes
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

// Set up mongoose connection
const mongoDB = keys.mongoURI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  morgan('combined', {
    skip(req, res) {
      return res.statusCode < 400;
    },
  }),
);
// app.use(express.static('dist'));

app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));

  const a = path.resolve('dist', 'index.html');
  // console.log('a: ', a);

  app.get('*', (req, res) => {
    res.sendFile(a);
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error: err });
});

app.listen(5000, () => console.log('Server listening in port 5000'));
