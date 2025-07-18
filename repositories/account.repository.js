const Account = require('../models/account.model');
const pool = require('../configs/database');

class AccountRepository {
    constructor() {
        this.tableName = 'Account'
    }

    async findById(hmrId) {
        const query = `
            SELECT
                acc.accId, acc.email, acc.password, acc.token, acc.tokenExpiry,
                hr.hmrId, hr.fullName,
                r.title AS roleName
            FROM HumanResource hr
            INNER JOIN Account acc ON hr.accId = acc.accId
            LEFT JOIN Role r ON acc.roleId = r.roleId
            WHERE hr.hmrId = ? AND acc.status = 'ACTIVE'
            LIMIT 1
        `;
        const [result] = await pool.execute(query, [hmrId]);
        return result[0] || null; 
    }
}

module.exports = new AccountRepository();