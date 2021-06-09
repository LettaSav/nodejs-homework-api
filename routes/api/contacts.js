const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controller');

const guard = require('../../services/guard');

const { validation } = require('../../services/validation.js');

router
  .get('/', guard, controller.listContacts)
  .post('/', guard, validation, controller.addContact);

router
  .get('/:contactId', guard, controller.getContactById)
  .delete('/:contactId', guard, controller.removeContact)
  .patch('/:contactId', guard, validation, controller.updateContact)
  .patch('/:contactId/favorite', guard, controller.updateStatusContact);

module.exports = router;
