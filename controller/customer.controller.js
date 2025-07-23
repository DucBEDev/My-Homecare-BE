const customerRepository = require('../repositories/customer.repository');

module.exports.getCustomerList = async (req, res) => {
    try {
        const { status, search, page, limit } = req.query;

        const result = await customerRepository.getCustomerList({ status, search, page, limit });

        const formattedResult = result.map(row => ({
            fullName: row.fullName,
            phoneNumber: row.phoneNumber,
            point: row.point,
            status: row.status,
            location: {
                address: row.addressNum,
                ward: row.ward,
                city: row.city
            }
        }));

        res.json({
            success: true,
            result: formattedResult
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}
