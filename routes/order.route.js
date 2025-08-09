const express = require('express');
const router = express.Router();

const controller = require('../controller/order.controller');

router.get('/', controller.getOrders);
router.get('/detail/:ordId', controller.getOrderDetail);
router.post('/add', controller.addOrderPost);
router.get('/add', controller.addOrder);

module.exports = router;    