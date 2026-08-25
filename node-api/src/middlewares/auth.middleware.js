const { verifyAccessToken } = require('../utils/jwt.utils');
const userRepository = require('../repositories/user.repository');
const { AuthenticationError } = require('../utils/apiError');
const asyncWrapper = require('../utils/asyncWrapper');

const authenticate = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Authentication required. Bearer token missing.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.id);

    if (!user || user.status === 'INACTIVE') {
      throw new AuthenticationError('User no longer exists or account is inactive');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AuthenticationError) throw err;
    throw new AuthenticationError('Invalid or expired authentication token');
  }
});

module.exports = authenticate;
