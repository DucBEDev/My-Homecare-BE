const pool = require('../configs/database');

class CustomerRepository {
    constructor() {
        this.tableName = 'Customer'
    }

    async getCustomerList({ status = 'all', search, page = 1, limit = 10 }) {
        let baseQuery = `
            FROM Customer AS c
            INNER JOIN Account AS a ON a.accId = c.accId
            INNER JOIN Location AS l ON l.locationId = c.locationId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter status
        if (status !== 'all') {
            baseQuery += ` AND a.status = ?`;
            params.push(status);
        }
    
        // Search by phone
        if (search) {
            baseQuery += ` AND c.phone LIKE ?`;
            params.push(`%${search}%`);
        }
    
        const offset = (page - 1) * limit;
        const dataQuery = `
            SELECT
                c.fullName, c.phone AS phoneNumber, c.point,
                a.status,
                JSON_OBJECT(
                    'addressNum', l.addressNum,
                    'ward', l.ward,
                    'city', l.city
                ) AS location
            ${baseQuery}
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
    
}

module.exports = new CustomerRepository();