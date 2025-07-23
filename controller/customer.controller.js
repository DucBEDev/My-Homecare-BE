const customerRepository = require('../repositories/customer.repository');

module.exports.getCustomerList = async (req, res) => {
    try {
        const {status, search, page, limit} = req.query;

        const result = await customerRepository.getCustomerList({status, search, page, limit});

        res.json({ 
            success: true, 
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}