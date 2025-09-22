// function to check if user has primary permission
async function checkPrimaryPermission(userId, resourceId) {

    const isPrimaryAvailable = Math.random() > 0.3;

    if (!isPrimaryAvailable) {
        throw new Error('Primary permission system unavailable');
    }

    //only admin has primary access
    return userId === 'admin';
}

// fallback system to check permission based on user role
function fallbackPermissionCheck(user, resourceId) {
    const allowedRoles = ['editor', 'admin'];
    return allowedRoles.includes(user.role);
}

module.exports = { checkPrimaryPermission, fallbackPermissionCheck };
