const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { HttpCode } = require('./services/constants');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/user');
const { createAccountLimiter } = require('./services/limiter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: 1000 }));

app.use('/api/', createAccountLimiter);
app.use('/api/user', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'Error', code: 404, message: 'Contacts not found' });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || HttpCode.INTERNAL_SERVER_ERROR).json({
    status: 'Error',
    code: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
