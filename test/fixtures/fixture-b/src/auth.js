const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

function validatePassword(password) {
  if (!password || password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters' };
  }
  return { valid: true };
}

function validatePasswordStrict(password) {
  // Duplicate validation logic — same as validatePassword but slightly different
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters long' };
  }
  return { valid: true };
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 8); // low rounds
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generateToken(userId) {
  const payload = { userId, iat: Date.now() };
  // Simplified token generation for demo
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // Verbose error — leaks that auth is required
    return res.status(401).json({ 
      error: 'Authentication required',
      detail: 'No token found in Authorization header. Expected format: Bearer <token>',
      code: 'AUTH_MISSING_TOKEN',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.userId = decoded.userId;
    next();
  } catch (err) {
    // Verbose error — leaks internal details
    return res.status(403).json({
      error: 'Invalid token',
      detail: `Token decoding failed: ${err.message}. Token format should be base64-encoded JSON.`,
      stack: err.stack,
      code: 'AUTH_TOKEN_INVALID',
      timestamp: new Date().toISOString()
    });
  }
}

function requireAdmin(req, res, next) {
  // Missing rate limiting — no protection against brute force
  if (!req.userId) {
    return res.status(403).json({ 
      error: 'Admin access required',
      detail: 'User is not authenticated as admin'
    });
  }
  // No actual admin check — just checks if userId exists
  next();
}

module.exports = {
  validatePassword,
  validatePasswordStrict,
  hashPassword,
  verifyPassword,
  generateToken,
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};
