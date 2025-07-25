const pool = require('../configs/database');

class humanResourceRepository {
    constructor() {
        this.tableName = 'HumanResource',
        this.roleMap = {
            helper: 'Helper',
            staff: 'Staff',
            admin: 'Admin'
        };
    }

    async getHRList({ type = 'helper', status = 'all', search, page = 1, limit = 10 }) {
        let baseQuery = `
            FROM HumanResource AS h
            INNER JOIN Account AS a ON a.accId = h.accId
            INNER JOIN Role AS r ON r.roleId = a.roleId
            INNER JOIN Location AS l ON l.locationId = h.locationId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter by type (role)
        const roleTitle = this.roleMap[type?.toLowerCase()];
        if (roleTitle) {
            baseQuery += ` AND r.title = ?`;
            params.push(roleTitle);
        }

        // Filter status
        if (status !== 'all') {
            baseQuery += ` AND a.status = ?`;
            params.push(status);
        }
    
        // Search by phone
        if (search) {
            baseQuery += ` AND (h.hmrId LIKE ? OR h.phone LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
    
        const offset = (page - 1) * limit;
        const dataQuery = `
            SELECT
                h.fullName, h.phone AS phoneNumber, h.birthDate AS dateOfBirth,
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

module.exports = new humanResourceRepository();