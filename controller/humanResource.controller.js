const helperRepository = require('../repositories/humanResource.repository');
const convertDateHelper = require('../helpers/convertDate.helper');
const moment = require('moment');

module.exports.getHRList = async (req, res) => {
    try {
        const { type, status, search, page, limit } = req.query;

        const result = await helperRepository.getHRList({ type, status, search, page, limit });
        const formatResult = result.data.map(ele => {
            return {
                ...ele,
                dateOfBirth: moment(ele.dateOfBirth).format('DD/MM/YYYY')
            }
        })

        res.json({
            success: true,
            result: formatResult,
            totalHRs: result.total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}
