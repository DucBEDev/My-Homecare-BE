const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../configs/database');
const SECRET_KEY = process.env.SECRET_KEY;
const accountRepository = require('../repositories/account.repository');

// [POST] /admin/auth/login
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

        if (!token || !tokenExpiry || tokenExpiry < new Date(today.toDateString())) {
            // Create new token
            token = jwt.sign(
                {
                    fullName: result.fullName,
                    role: result.roleName,
                    permissionList: result.permissionList
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
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None',
        });

        return res.status(200).json({
            fullName: result.fullName,
            role: result.roleName,
            permissionList: result.permissionList,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
}

// [GET] /admin/auth/validate
module.exports.validLogin = async (req, res) => {
    try {
        return res.status(200).json({
            message: 'Authenticated',
            user: req.user
        })
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
}

// [POST] /admin/auth/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production'
        });
    
        return res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
}