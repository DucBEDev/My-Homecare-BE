const express = require('express');
const router = express.Router();

const controller = require('../controller/order.controller');

router.get('/', controller.getOrders);

module.exports = router;    