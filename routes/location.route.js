const express = require('express');
const router = express.Router();

const controller = require('../controller/location.controller');

router.get('/province', controller.getProvinceList);
router.get('/ward/:provinceCode', controller.getWardList);

module.exports = router;