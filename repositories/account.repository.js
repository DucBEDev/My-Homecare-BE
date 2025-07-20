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
                r.title AS roleName, r.roleId
            FROM HumanResource hr
            INNER JOIN Account acc ON hr.accId = acc.accId
            LEFT JOIN Role r ON acc.roleId = r.roleId
            WHERE hr.hmrId = ? AND acc.status = 'ACTIVE'
            LIMIT 1
        `;
        const [result] = await pool.execute(query, [hmrId]);

        if (!result.length) {
            return null;
        }

        const roleId = result[0].roleId;
        const permissionQuery = `
            SELECT p.name AS permission
            FROM RolePermission rp
            JOIN Permission p ON rp.permissionId = p.permissionId
            WHERE rp.roleId = ?
        `;
        const [permissions] = await pool.execute(permissionQuery, [roleId]);
        return {
            ...result[0],
            permissionList: permissions.map(p => p.permission)
        }; 
    }
}

module.exports = new AccountRepository();