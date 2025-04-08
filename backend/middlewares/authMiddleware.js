const jwt = require('jsonwebtoken');

const authMiddleware = (allowedTypes) => {
  
  return (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedTypes.includes(decoded.type)) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      req.user = decoded; // Attach user details to the request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;