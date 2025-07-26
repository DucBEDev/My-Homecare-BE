const locationRepository = require('../repositories/location.repository');

// [GET] /admin/location/province
module.exports.getProvinceList = async (req, res) => {
    try {
        const { search } = req.query;

        const result = await locationRepository.getProvinceList({ search });
        
        res.json({
            success: true,
            result: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

// [GET] /admin/location/ward/:provinceCode
module.exports.getWardList = async (req, res) => {
    try {
        const { provinceCode } = req.params;
        const { search } = req.query;

        const result = await locationRepository.getWardList({ provinceCode, search });
        
        res.json({
            success: true,
            result: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}