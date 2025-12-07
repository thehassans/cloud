const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('URL:', req.originalUrl);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Auth header:', authHeader ? authHeader.substring(0, 50) + '...' : 'NONE');
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('Auth: No token extracted from header');
      return res.status(401).json({ error: 'Access token required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Auth: JWT_SECRET not configured!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth: Token decoded for uuid:', decoded.uuid);
    
    const users = await query(
      'SELECT id, uuid, email, first_name, last_name, role, status, preferred_language, preferred_currency FROM users WHERE uuid = ? AND status = ?',
      [decoded.uuid, 'active']
    );

    if (!users.length) {
      console.log('Auth: User not found for uuid:', decoded.uuid);
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    console.log('Auth: User authenticated:', users[0].email, 'Role:', users[0].role);
    req.user = users[0];
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token: ' + err.message });
    }
    return res.status(403).json({ error: 'Authentication failed' });
  }
};

const requireAdmin = (req, res, next) => {
  console.log('requireAdmin check - user:', req.user?.email, 'role:', req.user?.role);
  if (!req.user) {
    console.log('requireAdmin: No user found in request');
    return res.status(403).json({ error: 'Admin access required - not authenticated' });
  }
  if (!['admin', 'super_admin'].includes(req.user.role)) {
    console.log('requireAdmin: User role not admin:', req.user.role);
    return res.status(403).json({ error: 'Admin access required - insufficient role' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const users = await query(
        'SELECT id, uuid, email, first_name, last_name, role, status FROM users WHERE uuid = ? AND status = ?',
        [decoded.uuid, 'active']
      );
      if (users.length) {
        req.user = users[0];
      }
    }
  } catch (err) {
    // Silently fail for optional auth
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, requireSuperAdmin, optionalAuth };
