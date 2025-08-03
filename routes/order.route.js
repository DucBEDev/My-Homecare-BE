const express = require('express');
const router = express.Router();

const controller = require('../controller/order.controller');

router.get('/', controller.getOrders);
router.get('/detail', controller.getOrderDetail);
router.post('/add', controller.addOrder);

module.exports = router;    