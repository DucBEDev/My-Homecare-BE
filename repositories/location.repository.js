const pool = require('../configs/database');

class LocationRepository {
    constructor() {
        this.tableName1 = 'Provinces',
        this.tableName2 = 'Wards'
    }

    async getProvinceList({ search }) {
        let query = `
            SELECT 
                code AS provinceCode, fullName AS provinceFullName, name AS provinceName
            FROM Provinces
        `;
        const params = [];
    
        if (search) {
            query += `
                WHERE slug LIKE ?
                ORDER BY 
                    CASE 
                        WHEN slug LIKE ? THEN 0  
                        WHEN slug LIKE ? THEN 1  
                        ELSE 2
                    END,
                    slug ASC
            `;
            const keyword = `%${search}%`; // slug chứa keyword ở giữa
            const keywordStart = `${search}%`; // slug bắt đầu với keyword
            params.push(keyword, keywordStart, keyword);
        } else {
            query += `ORDER BY slug ASC`;
        }
    
        const [result] = await pool.execute(query, params);
        return result;
    }   
    
    async getWardList({ provinceCode, search }) {
        let query = `
            SELECT
                code AS wardCode, name AS wardName, fullName AS wardFullName
            FROM Wards 
            WHERE provinceCode = ${provinceCode}
        `;

        const params = [];
    
        if (search) {
            query += `
                 AND slug LIKE ?
                ORDER BY 
                    CASE 
                        WHEN slug LIKE ? THEN 0  
                        WHEN slug LIKE ? THEN 1  
                        ELSE 2
                    END,
                    slug ASC
            `;
            const keyword = `%${search}%`; // slug chứa keyword ở giữa
            const keywordStart = `${search}%`; // slug bắt đầu với keyword
            params.push(keyword, keywordStart, keyword);
        } else {
            query += `ORDER BY slug ASC`;
        }
    
        const [result] = await pool.execute(query, params);
        return result;
    }

    async getNextLocId() {
        const [rows] = await pool.execute(`
            SELECT locationId 
            FROM Location 
            ORDER BY locationId DESC LIMIT 1
        `);
        let lastId = rows[0]?.locationId || 'LOC0000000';

        // Create new accId
        const numberPart = parseInt(lastId.replace('LOC', ''), 10) + 1;
        const newLocId = 'LOC' + numberPart.toString().padStart(7, '0');

        return newLocId;
    }

    async findLocation(location) {
        const { addressNum, ward, city } = location;
        const query = `
            SELECT locationId
            FROM Location
            WHERE addressNum = ? AND ward = ? AND city = ?
        `;

        const [result] = await pool.execute(query, [addressNum, ward, city]);

        return result[0]?.locationId;
    }
}

module.exports = new LocationRepository();