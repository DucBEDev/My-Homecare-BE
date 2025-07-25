const Orders = require('../models/orders.model');
const pool = require('../configs/database');

class OrderRepository {
    constructor() {
        this.tableName = 'Orders'
    }

    async getOrderList({ status = 'all', search, convertFromDate, convertToDate, page = 1, limit = 10 }) {
        let baseQuery = `
            FROM Orders AS o
            INNER JOIN Customer AS c ON c.cusId = o.cusId
            INNER JOIN ServiceCategory AS sc ON sc.categoryId = o.serviceCatId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter status
        if (status !== 'all') {
            baseQuery += ` AND o.status = ?`;
            params.push(status);
        }
    
        // Search by ordId
        if (search) {
            baseQuery += ` AND o.ordId LIKE ?`;
            params.push(`%${search}%`);
        }
    
        // Filter date range
        if (convertFromDate && convertToDate) {
            baseQuery += ` AND DATE(o.ordDate) BETWEEN ? AND ?`;
            params.push(convertFromDate, convertToDate);
        }
        
        const offset = (page - 1) * limit;
        const dataQuery = `
            SELECT
                o.ordId AS orderId, o.ordDate AS orderDate, o.status,
                c.phone AS phoneNumberCustomers,
                sc.name AS serviceCategory,
                (
                    SELECT SUM(ordDetailCost)
                    FROM OrderDetail od
                    WHERE od.ordId = o.ordId
                ) AS cost
            ${baseQuery}
            ORDER BY o.ordDate DESC
            LIMIT ${Number(offset)}, ${Number(limit)}
        `;
        const [dataResult] = await pool.execute(dataQuery, params);
    
        const countQuery = `
            SELECT COUNT(*) AS total
            ${baseQuery}
        `;
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0]?.total || 0;
    
        return {
            total,
            data: dataResult
        };
    }
    

    async getOrderDetail() {
        const query = `
            SELECT
                o.ordId AS orderId, o.ordDate AS orderDate, o.paymentType, 
            FROM Orders o

        `
    }
}

module.exports = new OrderRepository();