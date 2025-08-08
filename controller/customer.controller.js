const customerRepository = require('../repositories/customer.repository');
const discountRepository = require('../repositories/discount.repository');

// [GET] /admin/customer
module.exports.getCustomerList = async (req, res) => {
    try {
        const { status, search, page, limit } = req.query;

        const result = await customerRepository.getCustomerList({ status, search, page, limit });

        res.status(200).json({
            success: true,
            result: result.data,
            totalCustomers: result.total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [GET] /admin/customer/checkExist
module.exports.checkExist = async (req, res) => {
    try {
        const { cusPhone } = req.params;

        const customer = await customerRepository.findByPhone(cusPhone);
        if (!customer) {
            return res.status(404).json({
                success: 'false',
                message: "Customer not found"
            })
        }
        const disCusList = await discountRepository.getListOnCusId(customer.cusId);

        res.status(200).json({
            success: true,
            customer: customer,
            discountList: disCusList
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

