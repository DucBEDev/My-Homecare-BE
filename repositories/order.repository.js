const Orders = require('../models/orders.model');
const pool = require('../configs/database');

class OrderRepository {
    constructor() {
        this.tableName = 'Orders'
    }

    async getOrderList({ status = 'all', search, fromDate, toDate, page = 1, limit = 10 }) {
        let query = `
            SELECT
                o.ordId, o.ordDate, o.status,
                c.phone AS phoneNumberCustomers,
                sc.name AS serviceCategory,
                (
                    SELECT SUM(ordDetailCost)
                    FROM OrderDetail od
                    WHERE od.ordId = o.ordId
                ) AS cost
            FROM Orders AS o
            INNER JOIN Customer AS c ON c.cusId = o.cusId
            INNER JOIN ServiceCategory AS sc ON sc.categoryId = o.serviceCatId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter status
        if (status !== 'all') {
            query += ` AND o.status = ?`;
            params.push(status);
        }
    
        // Search by ordId
        if (search) {
            query += ` AND o.ordId LIKE ?`;
            params.push(`%${search}%`);
        }

        // Filter date range
        if (fromDate && toDate) {
            query += ` AND DATE(o.ordDate) BETWEEN ? AND ?`;
            params.push(fromDate, toDate);
        }
    
        // Sort
        query += ` ORDER BY o.ordDate DESC`;
    
        // Pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT ${offset}, ${limit}`;
    
        const [result] = await pool.execute(query, params);
        return result;
    }
    
}

module.exports = new OrderRepository();