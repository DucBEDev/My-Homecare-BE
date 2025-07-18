const systemConfig = require('../configs/system');

// Import routes
const dashboardRoutes = require('./dashboard.route');
const authRoutes = require('./auth.route');

// Import middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Export routes
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/auth', authRoutes);
}