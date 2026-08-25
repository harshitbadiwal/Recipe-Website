const { AuthorizationError } = require('../utils/apiError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('User context not found'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(`Access denied. Role '${req.user.role}' is not authorized.`));
    }

    next();
  };
};

module.exports = authorize;
