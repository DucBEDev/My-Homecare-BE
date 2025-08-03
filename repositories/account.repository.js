const Account = require('../models/account.model');
const pool = require('../configs/database');
const customerRepository = require('./customer.repository');
const locationRepository = require('../repositories/location.repository');

class AccountRepository {
    constructor() {
        this.tableName = 'Account'
    }

    async findById(hmrId) {
        const query = `
            SELECT
                acc.accId, acc.password, acc.token, acc.tokenExpiry,
                hr.fullName,
                r.title AS roleName, r.roleId
            FROM HumanResource hr
            INNER JOIN Account acc ON hr.accId = acc.accId
            LEFT JOIN Role r ON acc.roleId = r.roleId
            WHERE hr.hmrId = ? AND acc.status = 'active' AND hr.type != 'Helper'
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

    async createCusAcc(emailTemp, passTemp, cusRoleId, phoneNumberCustomer, fullNameCustomer, locationCustomer, locationId) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // Create new id
            const newAccId = await this.getNextAccId(); 
            const newCusId = await customerRepository.getNextCusId(); 

            if (!locationId) {
                locationId = await locationRepository.getNextLocId(); 

                // INSERT Location
                await conn.execute(
                    `INSERT INTO Location (locationId, city, addressNum, ward)
                    VALUES (?, ?, ?, ?)`,
                    [locationId, locationCustomer.city, locationCustomer.addressNum, locationCustomer.ward]
                );
            }

            // INSERT Account
            await conn.execute(
                `INSERT INTO Account (accId, email, password, roleId, status)
                VALUES (?, ?, ?, ?, 'active')`,
                [newAccId, emailTemp, passTemp, cusRoleId]
            );

            // INSERT Customer
            await conn.execute(
                `INSERT INTO Customer (cusId, accId, fullName, phone, locationId)
                VALUES (?, ?, ?, ?, ?)`,
                [newCusId, newAccId, fullNameCustomer, phoneNumberCustomer, locationId]
            );

            await conn.commit();

            return {
                success: true,
                message: 'Customer account created successfully.',
                accId: newAccId,
                cusId: newCusId,
                locationId: locationId
            };
        } catch (err) {
            await conn.rollback();
            console.error('Transaction error:', err);
            throw err;
        } finally {
            conn.release();
        }
    }

    async getNextAccId() {
        const [rows] = await pool.execute(`
            SELECT accId 
            FROM Account 
            ORDER BY accId DESC LIMIT 1
        `);
        let lastId = rows[0]?.accId || 'ACC0000000';

        // Create new accId
        const numberPart = parseInt(lastId.replace('ACC', ''), 10) + 1;
        const newAccId = 'ACC' + numberPart.toString().padStart(7, '0');

        return newAccId;
    }
}

module.exports = new AccountRepository();