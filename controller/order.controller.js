const pool = require('../configs/database');
const orderRepository = require('../repositories/order.repository');
const moment = require('moment');
const convertDateHelper = require('../helpers/convertDate.helper');
  
// [GET] /admin/order
module.exports.getOrders = async (req, res) => {
    try {
        const { status, search, fromDate, toDate, page, limit } = req.query;
        const convertFromDate = fromDate ? convertDateHelper.convertToISODate(fromDate) : null;
        const convertToDate = toDate ? convertDateHelper.convertToISODate(toDate) : null;

        const result = await orderRepository.getOrderList({status, search, convertFromDate, convertToDate, page, limit});

        const formatResult = result.data.map(ele => {
            return {
                ...ele,
                orderDate: moment(ele.orderDate).format('DD/MM/YYYY HH:mm:ss')
            }
        })

        res.json({ 
            success: true, 
            result: formatResult,
            totalOrders: result.total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [GET] /admin/order/detail
module.exports.getOrderDetail = async (req, res) => {
    try {
        const { type } = req.query;

        if (type == 'all') {
            const result = await orderRepository.getOrderDetail();
            console.log(result)

        } else {

        }
    } catch (error) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}