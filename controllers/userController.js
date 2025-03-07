const User = require('../model/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
const UploadAvatar = require('../services/upload-avatars-local');

require('dotenv').config();
const { HttpCode } = require('../services/constants');
const EmailService = require('../services/email');
const { CreateSenderSendGrid } = require('../services/sender');

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
      return res.status(HtttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const newUser = await User.create({ ...req.body, verificationToken });
    try {
      const emailService = newEmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid(),
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email);
    } catch (error) {
      console.log(erorr.message);
    }

    return res.status(HtttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatarURL,
        },
      },
    });
  } catch (e) {
    if (e.name === 'validationError' || e.name === 'mongoError') {
      return next({
        status: HttrpCode.BAD_REQUEST,
        message: e.message.replace(/"/g, ''),
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
    if (!user.verify) {
      return res.status(HtttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing required field email',
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.name,
      oldFile: req.user.avatar,
    });
    await User.updateAvatar(id.avatarUrl);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken,
    );
    if (user) {
      await Users.updateVerification(user.id, true, null);
      return next({
        status: 'success',
        code: HttpCode.OK,
      });
    }
    return res.json({
      status: HttpCode.NOT_FOUND,
      message: 'User not found',
    });
  } catch (error) {
    next(error);
  }
};

const repeatSendEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    const { email, verifyToken, verify } = user;
    if (!verify) {
      try {
        const emailService = newEmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid(),
        );
        await emailService.sendVerifyPasswordEmail(verifyToken, email);
        return res.status(HtttpCode.OK).json({
          status: 'ok',
          code: HttpCode.OK,
          message: 'Verification email sent',
        });
      } catch (error) {
        console.log(erorr.message);
        return next(error);
      }
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Verification has already been passed',
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  updateSubscription,
  avatars,
  verify,
  repeatSendEmailVerify,
};
