const pool = require('../configs/database');
const orderRepository = require('../repositories/order.repository');
const moment = require('moment');

function convertToISODate(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}
  
// [GET] /admin/order
module.exports.getOrders = async (req, res) => {
    try {
        const {status, search, fromDate, toDate, page, limit} = req.query;
        const convertFromDate = fromDate ? convertToISODate(fromDate) : null;
        const convertToDate = toDate ? convertToISODate(toDate) : null;

        const result = await orderRepository.getOrderList({status, search, convertFromDate, convertToDate, page, limit});

        const formatResult = result.map(ele => {
            return {
                ...ele,
                ordDate: moment(ele.ordDate).format('DD/MM/YYYY')
            }
        })

        res.json({ 
            success: true, 
            result: formatResult
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}