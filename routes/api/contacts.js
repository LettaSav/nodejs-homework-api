const express = require('express');
const router = express.Router();
const controller = require('../../services/controller');

const { validation } = require('../../services/validation.js');

router
  .get('/', controller.listContacts)
  .post('/', validation, controller.addContact);

router
  .get('/:contactId', controller.getContactById)
  .delete('/:contactId', controller.removeContact)
  .patch('/:contactId', validation, controller.updateContact)
  .patch('/:contactId/favorite', controller.updateStatusContact);

module.exports = router;
