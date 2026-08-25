const userRepository = require('../repositories/user.repository');
const { generateAccessToken } = require('../utils/jwt.utils');
const { ConflictError, AuthenticationError, NotFoundError } = require('../utils/apiError');
const ROLES = require('../constants/roles');

class AuthService {
  async register({ name, email, password, role = ROLES.USER }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const assignedRole = role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;

    const user = await userRepository.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
    });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status === 'INACTIVE') {
      throw new AuthenticationError('Account is disabled. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
