const Orders = require('../models/orders.model');
const pool = require('../configs/database');

class OrderRepository {
    constructor() {
        this.tableName = 'Orders'
    }

    async orderListBaseOnType(status) {
        const query = 
            `
                    
            `

        const [result] = await pool.execute(query);
        return result[0] || null; 
    }
}

module.exports = new OrderRepository();