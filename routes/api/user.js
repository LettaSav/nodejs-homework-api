const express = require('express');
const router = express.Router();
const controller = require('../../controllers/userController');
const { authValidation, subValidation } = require('../../services/validation');
const guard = require('../../services/guard');
const upload = require('../../services/upload');

router.get('/auth/verify/:verificatiToken', controller.verify);
router.post('/users/verify', controller.repeatSendEmailVerify);
router.post('/users/register', authValidation, controller.register);
router.post('/users/login', authValidation, controller.login);
router.post('/users/logout', guard, controller.logout);
router.get('/current', guard, controller.currentUser);
router.patch('/', guard, subValidation, controller.updateSubscription);
router.patch('/avatars', [guard, upload.single('avatar')], controller.avatars);

module.exports = router;
