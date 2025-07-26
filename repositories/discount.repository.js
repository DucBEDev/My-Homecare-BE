const pool = require('../configs/database');

class DiscountRepository {
    constructor() {
        this.tableName = 'Discount'
    }   
    
    async getListOnCusId(cusId) {
        const query = `
            SELECT 
                d.disId, d.title, d.desc, d.minCost, d.percentage
            FROM Discount d
            WHERE 
                d.status = 'active'
                AND d.usageLimit > 0
                AND NOW() BETWEEN d.startDate AND d.endDate
                AND d.disId NOT IN (
                    SELECT ud.disId 
                    FROM UsedDiscount ud 
                    WHERE ud.cusId = ?
                )
        `;
        const [result] = await pool.execute(query, [cusId]);
        return result;
    }
    
}

module.exports = new DiscountRepository();