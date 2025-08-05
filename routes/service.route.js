const express = require('express');
const router = express.Router();

const controller = require('../controller/service.controller');

router.get('/', controller.getServiceList);

module.exports = router;