const jwt = require('jsonwebtoken');

// Middleware for checking JWT token
const checkToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Access denied, token missing!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = checkToken;
