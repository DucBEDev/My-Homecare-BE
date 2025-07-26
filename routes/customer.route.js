const express = require('express');
const router = express.Router();

const controller = require('../controller/customer.controller');

router.get('/', controller.getCustomerList);
router.get('/checkExist/:cusPhone', controller.checkExist);

module.exports = router;