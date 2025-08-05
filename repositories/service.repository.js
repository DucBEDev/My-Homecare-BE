const pool = require('../configs/database');

class ServiceRepository {
    constructor() {
        this.tableName1 = 'Service',
        this.tableName2 = 'ServiceCategory'
    }

    async getServiceList(status = 'all') {
        // Get service category list
        let query = `
            SELECT 
                sc.categoryId, sc.name
            FROM ServiceCategory sc
        `;
        const params = [];

        if (status != 'all') {
            query += ` WHERE status = ?`;
            params.push(status);
        }

        const [scList] = await pool.execute(query, params);
        // End Get service category list

        // Get service list respectively
        for (const category of scList) {
            const serviceQuery = `
                SELECT 
                    s.serviceId, s.title, s.desc, s.basePrice, s.extraCharge
                FROM Service s
                WHERE s.categoryId = ?
            `;
            const [services] = await pool.execute(serviceQuery, [category.categoryId]);
            category.services = services;
        }
        // End Get service list respectively
        return scList;
    }

}

module.exports = new ServiceRepository();