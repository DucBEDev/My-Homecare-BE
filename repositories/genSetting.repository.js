const pool = require('../configs/database');

class GenSettingRepository {
    constructor() {
        this.tableName = 'Service'
    }

    async getSetting() {
        const query = `
            SELECT *
            FROM GeneralSetting
        `;

        const [result] = await pool.execute(query);

        return result[0];
    }
}

module.exports = new GenSettingRepository();