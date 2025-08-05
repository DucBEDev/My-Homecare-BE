const pool = require('../configs/database');
const moment = require('moment');
const bcrypt = require('bcrypt');

const convertDateHelper = require('../helpers/convertDate.helper');
const orderRepository = require('../repositories/order.repository');
const accountRepository = require('../repositories/account.repository');
const locationRepository = require('../repositories/location.repository');
const serviceRepository = require('../repositories/service.repository');
const genSettingRepository = require('../repositories/genSetting.repository');
  
// [GET] /admin/order
module.exports.getOrders = async (req, res) => {
    try {
        const { status, search, fromDate, toDate, page, limit } = req.query;
        const convertFromDate = fromDate ? convertDateHelper.convertToISODate(fromDate) : null;
        const convertToDate = toDate ? convertDateHelper.convertToISODate(toDate) : null;

        const result = await orderRepository.getOrderList({status, search, convertFromDate, convertToDate, page, limit});

        const formatResult = result.data.map(ele => {
            return {
                ...ele,
                orderDate: moment(ele.orderDate).format('DD/MM/YYYY HH:mm:ss')
            }
        })

        res.status(200).json({ 
            success: true, 
            result: formatResult,
            totalOrders: result.total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [GET] /admin/order/detail
module.exports.getOrderDetail = async (req, res) => {
    try {
        const { type } = req.query;

        if (type == 'all') {
            const result = await orderRepository.getOrderDetail();
            console.log(result)

        } else {

        }
    } catch (error) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [POST] /admin/order/add
module.exports.addOrderPost = async (req, res) => {
    try {
        const { 
            phoneNumberCustomer, fullNameCustomer, locationCustomer, serviceType, workDays, workTime, 
            totalHelperCost, totalOrderCost, discounts, isCusHasAccount, customerId, paymentType 
        } = req.body;

        let cusId = customerId;
        let locationId = await locationRepository.findLocation(locationCustomer);

        // Create customer account if not exists
        if (isCusHasAccount == false) {
            const currentTime = Date.now();
            const emailTemp = 'khach' + String(currentTime) + '@gmail.com';
            const passTemp = await bcrypt.hash('111111', 12);
            const [cusRoleId] = await pool.execute(
                `
                    SELECT roleId
                    FROM Role
                    WHERE title = 'Customer' AND status = 'active'
                `
            );
            
            const createAccResult = await accountRepository.createCusAcc(emailTemp, passTemp, cusRoleId[0].roleId, phoneNumberCustomer, fullNameCustomer, locationCustomer, locationId);
            cusId = createAccResult.cusId;
            locationId = createAccResult.locationId;

            if (!createAccResult.success) {
                return res.status(500).json({
                    success: false,
                    message: "Server error!"
                });
            }
        }

        // Create order
        const formatWorkStartDate = convertDateHelper.convertDateTime(workDays.startDate, workTime.startTime);
        const formatWorkEndDate = convertDateHelper.convertDateTime(workDays.endDate, workTime.endTime);
        const discountString = discounts.toString();

        const createOrdResult = await orderRepository.createOrder(
                                        { cusId, locationId, paymentType, formatWorkStartDate, formatWorkEndDate, 
                                        serviceType, totalHelperCost, totalOrderCost, discountString });

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [GET] /admin/order/add
module.exports.addOrder = async (req, res) => {
    try {
        // Get active service list
        const serviceList = await serviceRepository.getServiceList('active');

        // Get open/close hour, fee
        const systemSetting = await genSettingRepository.getSetting();

        return res.status(200).json({
            success: true,
            serviceList,
            systemSetting: {
                openHours: systemSetting.openHours,
                closeHours: systemSetting.closeHours,
                platformFee: systemSetting.platformFee,
                otherFee: systemSetting.otherFee,
                helperShare: systemSetting.helperShare,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}