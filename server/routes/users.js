const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../services/authMiddleware');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/detail', authMiddleware, userController.user);

router.post('/forgotpassword', userController.forgotPassword);

router.get('/resetpassword/:token', userController.resetPassword);

router.patch('/resetpasswordviaemail', userController.resetPasswordViaEmail);

module.exports = router;
