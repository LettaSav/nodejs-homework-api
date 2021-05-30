const Joi = require('joi');

const { HttpCode } = require('./constants');

const schemaValidation = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
  favorite: Joi.string(),
  subscription: Joi.any().valid('free', 'pro', 'premium'),
});

const schemaAuthValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

const schemaSubValidation = Joi.object({
  subscription: Joi.any().valid('free', 'pro', 'premium').required(),
});
const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Bad request`,
    });
  }
  next();
};
module.exports.validation = (req, _res, next) => {
  return validate(schemaValidation, req.body, next);
};
module.exports.AuthValidation = (req, _res, next) => {
  return validate(schemaAuthValidation, req.body, next);
};
module.exports.SubValidation = (req, _res, next) => {
  return validate(schemaSubValidation, req.body, next);
};
