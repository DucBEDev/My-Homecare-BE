const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../configs/database');
const SECRET_KEY = process.env.SECRET_KEY;
const accountRepository = require('../repositories/account.repository');

// [POST] /admin/login
module.exports.login = async (req, res) => {
    const { hmrId, password } = req.body;

    try {
        const result = await accountRepository.findById(hmrId);
        if (!result) {
            return res.status(401).json({
                message: "UserId or password is not correct!"
            })
        }

        const match = await bcrypt.compare(password, result.password);
        if (!match) {
            return res.status(401).json({
                message: "UserId or password is not correct!"
            })
        }

        const tokenExpiry = result.tokenExpiry ? new Date(result.tokenExpiry) : null;
        const today = new Date();
        let token = result.token;
        let newTokenCreated = false;

        if (!token || !tokenExpiry || tokenExpiry < new Date(today.toDateString())) {
            // Create new token
            token = jwt.sign(
                {
                    accId: result.accId,
                    hmrId: result.hmrId,
                    role: result.roleName
                },
                SECRET_KEY,
                { expiresIn: '1d' }
            );

            const expiryDate = new Date();
            expiryDate.setDate(today.getDate() + 1);
            const expiryDateString = expiryDate.toISOString().split('T')[0];

            await pool.execute(
                'UPDATE Account SET token = ?, tokenExpiry = ? WHERE accId = ?',
                [token, expiryDateString, result.accId]
            );
            
            newTokenCreated = true;
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            hmrId: result.hmrId,
            accId: result.accId,
            fullName: result.fullName,
            role: result.roleName,
            permissionList: result.permissionList,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
}