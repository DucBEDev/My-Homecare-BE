const Orders = require('../models/orders.model');
const pool = require('../configs/database');
const moment = require('moment');

class OrderRepository {
    constructor() {
        this.tableName = 'Orders'
    }

    async getOrderList({ status = 'all', search, convertFromDate, convertToDate, page = 1, limit = 10 }) {
        let baseQuery = `
            FROM Orders AS o
            INNER JOIN Customer AS c ON c.cusId = o.cusId
            INNER JOIN Service AS s ON s.serviceId = o.serviceId
            WHERE 1 = 1
        `;
    
        const params = [];
    
        // Filter status
        if (status !== 'all') {
            baseQuery += ` AND o.status = ?`;
            params.push(status);
        }
    
        // Search by ordId
        if (search) {
            baseQuery += ` AND o.ordId LIKE ?`;
            params.push(`%${search}%`);
        }
    
        // Filter date range
        if (convertFromDate && convertToDate) {
            baseQuery += ` AND DATE(o.ordDate) BETWEEN ? AND ?`;
            params.push(convertFromDate, convertToDate);
        }
        
        const offset = (page - 1) * limit;
        const dataQuery = `
            SELECT
                o.ordId AS orderId, o.ordDate AS orderDate, o.status,
                c.phone AS phoneNumberCustomers,
                s.title AS serviceName,
                (
                    SELECT SUM(ordDetailCost)
                    FROM OrderDetail od
                    WHERE od.ordId = o.ordId
                ) AS cost
            ${baseQuery}
            ORDER BY o.ordDate DESC
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
    
    async getOrderDetail(ordId) {
        const ordQuery = `
            SELECT
                o.ordId AS orderId, o.ordDate AS orderDate, o.paymentType, o.status,
                c.fullName AS fullNameCustomer, c.phone AS phoneCustomer,
                JSON_OBJECT(
                    'addressNum', l.addressNum,
                    'ward', l.ward,
                    'city', l.city
                ) AS workingLocation,
                d.title AS discountTitle, d.percentage AS discountPercentage
            FROM Orders o
            INNER JOIN Customer c ON o.cusId = c.cusId
            INNER JOIN Location l ON o.locationId = l.locationId
            LEFT JOIN Discount d ON o.discId = d.disId
            WHERE o.ordId = ?
        `;
        const [ordResult] = await pool.execute(ordQuery, [ordId]);

        if (ordResult.length == 0) {
            return null;
        }

        const detailQuery = `
            SELECT 
                od.detailId, od.workingDate, od.ordDetailCost, od.helperCost, od.isLoseThings,
                od.isBreakThings, od.comment, od.rating, od.status, od.workStartedAt, od.workEndedAt,
                JSON_OBJECT(
                    'helperId', h.hmrId,
                    'fullName', h.fullName,
                    'phone', h.phone
                ) AS helperInfo
            FROM OrderDetail od
            LEFT JOIN HumanResource h ON od.helperId = h.hmrId
            WHERE od.ordId = ?
        `;
        const [detailResult] = await pool.execute(detailQuery, [ordId]);

        const formatDetail = detailResult.map(ele => {
            return {
                ...ele,
                workingDate: moment(ele.workingDate).format('DD/MM/YYYY')
            }
        })

        return {
            ...ordResult[0],
            details: formatDetail
        };
    }

    async getNextOrdId() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        let newOrdId = `ORD${day}${month}`;

        const query = `
            SELECT ordId
            FROM Orders
            WHERE ordId LIKE ? AND DATE(ordDate) = CURDATE()
            ORDER BY ordId DESC LIMIT 1
        `;
        const [rows] = await pool.execute(query, [`%${newOrdId}%`]);
        const lastOrdId = rows[0]?.ordId || newOrdId + '000';

        const numberPart = parseInt(lastOrdId.replace(newOrdId, ''), 10) + 1;
        const nextOrdId = newOrdId + numberPart.toString().padStart(3, '0');
        
        return nextOrdId;
    }

    async getNextDetailId() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        let newDetailId = `D${day}${month}`;

        const query = `
            SELECT detailId
            FROM OrderDetail
            WHERE detailId LIKE ? AND DATE(orderReceivedAt) = CURDATE()
            ORDER BY detailId DESC LIMIT 1
        `;
        const [rows] = await pool.execute(query, [`%${newDetailId}%`]);
        const lastDetailId = rows[0]?.detailId || newDetailId + '000';

        const numberPart = parseInt(lastDetailId.replace(newDetailId, ''), 10) + 1;
        const nextDetailId = newDetailId + numberPart.toString().padStart(5, '0');
        
        return nextDetailId;
    }

    async createOrder(params) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            const { cusId, locationId, paymentType, formatWorkStartDate, formatWorkEndDate, 
                    serviceType, totalHelperCost, totalOrderCost, discountString } = params;

            // Insert order
            const nextOrdId = await this.getNextOrdId();

            await conn.execute(
                `INSERT INTO Orders (ordId, cusId, paymentType, startDate, endDate, serviceId, status, locationId, discId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `,
                [nextOrdId, cusId, paymentType, formatWorkStartDate, formatWorkEndDate, serviceType, 'pending', locationId, discountString]
            );

            // Insert order detail
            const start = new Date(formatWorkStartDate);
            const end = new Date(formatWorkEndDate);

            let baseDetailId = await this.getNextDetailId(); 
            let prefix = baseDetailId.slice(0, 5); 
            let numberPart = parseInt(baseDetailId.slice(5));
            let i = 0;
            const values = [];

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1), i++) {
                const workingDate = new Date(d);
                const detailId = `${prefix}${(numberPart + i).toString().padStart(5, '0')}`;

                values.push([
                    nextOrdId, detailId, workingDate, totalOrderCost,
                    totalHelperCost, 'pending', formatWorkStartDate, formatWorkEndDate
                ]);
            }

            await conn.query(
                `INSERT INTO OrderDetail (ordId, detailId, workingDate, ordDetailCost, helperCost, status, workStartedAt, workEndedAt) VALUES ?`,
                [values]
            );

            await conn.commit();

            return true;
        } catch (err) {
            await conn.rollback();
            console.error('Transaction error:', err);
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = new OrderRepository();