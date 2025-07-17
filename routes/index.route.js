const systemConfig = require('../configs/system');

// Import routes
const dashboardRoutes = require('./dashboard.route');

// Export routes
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
}