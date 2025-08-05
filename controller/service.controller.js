// [GET] /admin/service
module.exports.getServiceList = async (req, res) => {
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