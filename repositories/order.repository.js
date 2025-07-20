const Orders = require('../models/orders.model');
const pool = require('../configs/database');

class OrderRepository {
    constructor() {
        this.tableName = 'Orders'
    }

    async orderListBaseOnType(status) {
        const query = `
            SELECT
                o.orderId, o.orderDate, o.workingArea
            FROM Orders AS o
        `

        const [result] = await pool.execute(query);
        return result[0] || null; 
    }
}

module.exports = new OrderRepository();