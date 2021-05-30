const express = require('express');
const router = express.Router();
const controller = require('../../services/userController');

const { authValidation, subValidation } = require('../../services/validation');

const guard = require('../../services/guard');

router.post('/users/register', authValidation, controller.reg);
router.post('/users/login', authValidation, controller.login);
router.post('/users/logout', guard, controller.logout);
router.get('/current', guard, controller.currentUser);
router.patch('/', guard, subValidation, controller.updateSubscription);

module.export = router;
