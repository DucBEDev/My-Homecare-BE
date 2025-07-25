const express = require('express');
const router = express.Router();

const controller = require('../controller/humanResource.controller');

router.get('/', controller.getHRList);

module.exports = router;