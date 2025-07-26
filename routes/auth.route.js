const express = require('express');
const router = express.Router();

const controller = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/validate', authMiddleware.auth, controller.validLogin)

module.exports = router;