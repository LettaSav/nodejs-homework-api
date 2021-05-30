const User = require('../model/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

require('dotenv').config();

const { HttpCode } = require('../services/constants');

const reg = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (user) {
      return res.status(HtttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const newUser = await User.create(req.body);

    return res.status(HtttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === 'validationError' || e.name === 'mongoError') {
      return next({
        status: HttrpCode.BAD_REQUEST,
        message: Joi.isError(new Error('Bad Request')),
      });
    }
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    const isValidPassword = await user.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HtttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h' });
    await Users.updateToken(user.id, token);
    return res.status(HtttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token: user.token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === 'TypeError') {
      return next({
        status: HttrpCode.BAD_REQUEST,
        message: 'Bad Request',
      });
    }
    next(e);
  }
};
const logout = async (req, res, _next) => {
  const id = req.user.id;
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({
    status: 'success',
    code: HttpCode.NO_CONTENT,
    data: {
      token: user.token,
      user: {
        email: User.email,
        subscription: User.subscription,
      },
    },
  });
};

const currentUser = async (req, res, next) => {
  const id = req.user.id;
  try {
    const user = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
const updateSubscription = async (req, res, next) => {
  const id = req.user.id;
  try {
    await Users.updateSubUser(id, req.body.subscription);
    const user = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
    next(e);
  }
};

module.export = {
  reg,
  login,
  logout,
  currentUser,
  updateSubscription,
};
