import 'core-js/es6/promise';
import 'core-js/es6/set';
import 'core-js/es6/map';

import * as yup from 'yup';

const schemaValidation = yup.object().shape({
  name: yup.string().alphanum().min(3).max(20),
  email: yup.string().email(),
  phone: yup.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
});
const schemaUpdateContact = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().min(6).required(),
  phone: yup.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
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
