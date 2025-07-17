const pool = require('../configs/database');

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS time');
        res.json({ success: true, server_time: rows[0].time });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
}