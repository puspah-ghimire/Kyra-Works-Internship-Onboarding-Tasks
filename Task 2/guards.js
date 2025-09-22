const { checkPrimaryPermission, fallbackPermissionCheck } = require('./permission');

// Middleware guard with fallback
async function checkPermissionWithFallback(req, res, next) {
    const user = req.body.user;
    const resourceId = req.body.resourceId;

    try {
        const allowed = await checkPrimaryPermission(user.id, resourceId);
        if (allowed) {
            return next();
        }
    } catch (error) {
        console.warn('Primary check failed, using fallback:', error.message);
    }

    //use fallback if primary fails
    const fallbackAllowed = fallbackPermissionCheck(user, resourceId);
    if (fallbackAllowed) {
        return next();
    }

    return res.status(403).json({ error: 'Access denied' });
}

module.exports = { checkPermissionWithFallback };
