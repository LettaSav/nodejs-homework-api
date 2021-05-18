const Joi = require('joi');

const schemaValidation = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
  favorite: Joi.string(),
});
const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next({
      status: 400,
      message: `Bad request`,
    });
  }
  next();
};
module.exports.validation = (req, _res, next) => {
  return validate(schemaValidation, req.body, next);
};
