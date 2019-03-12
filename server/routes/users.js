const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/detail', (req, res) => {
  res.send('response from users route');
});
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
