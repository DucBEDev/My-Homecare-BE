const express = require('express');
const router = express.Router();

const controller = require('../controller/order.controller');

router.get('/', controller.getOrders);
router.get('/detail', controller.getOrderDetail)

module.exports = router;    