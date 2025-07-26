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

}

module.exports = new LocationRepository();