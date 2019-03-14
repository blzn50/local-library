const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../services/authMiddleware');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/detail', authMiddleware, userController.user);
module.exports = router;
