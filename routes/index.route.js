const systemConfig = require('../configs/system');

// Import routes
const dashboardRoutes = require('./dashboard.route');
const authRoutes = require('./auth.route');
const orderRoutes = require('./order.route');
const customerRoutes = require('./customer.route');
const humanResourceRoutes = require('./humanResource.route');
const locationRoutes = require('./location.route');
const serviceRoutes = require('./service.route');

// Import middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Export routes
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/auth', authRoutes);
    // app.use(PATH_ADMIN + '/order', authMiddleware.auth, orderRoutes);
    app.use(PATH_ADMIN + '/order', orderRoutes);
    app.use(PATH_ADMIN + '/customer', customerRoutes);
    app.use(PATH_ADMIN + '/humanResource', humanResourceRoutes);
    app.use(PATH_ADMIN + '/location', locationRoutes);
    app.use(PATH_ADMIN + '/service', serviceRoutes);
}