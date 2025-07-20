const pool = require('../configs/database');
const orderRepository = require('../repositories/order.repository');

// [GET] /admin/order
module.exports.getOrders = async (req, res) => {
    try {
        const result = await orderRepository.orderListBaseOnType();
        console.log(result)
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
}