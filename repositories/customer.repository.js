const pool = require('../configs/database');

class CustomerRepository {
    constructor() {
        this.tableName = 'Customer'
    }

    async getCustomerList({ status = 'all', search, page = 1, limit = 10 }) {
        let query = `
            SELECT
                c.fullName, c.phone AS phoneNumber, c.point,
                a.status,
                l.addressNum, l.ward, l.city
            FROM Customer AS c
            INNER JOIN Account AS a ON a.accId = c.accId
            INNER JOIN Location AS l ON l.locationId = c.locationId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter status
        if (status !== 'all') {
            query += ` AND a.status = ?`;
            params.push(status);
        }
    
        // Search by ordId
        if (search) {
            query += ` AND c.phone LIKE ?`;
            params.push(`%${search}%`);
        }
    
        // Pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT ${offset}, ${limit}`;
    
        const [result] = await pool.execute(query, params);
        return result;
    }
    
}

module.exports = new CustomerRepository();