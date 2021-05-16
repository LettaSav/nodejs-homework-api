const Joi = require('Joi');

const schemaValidation = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
});
const schemaUpdateContact = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
});
const validate = (schema, obj, next) => {
  const { error } = schema.validate.obj;
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Bad request`,
    });
  }
  next();
};
module.exports.createContact = (req, _res, next) => {
  return validate(schemaValidation, req.body, next);
};
module.exports.updateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
