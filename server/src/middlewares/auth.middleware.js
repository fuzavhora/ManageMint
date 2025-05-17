const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


exports.isUser = (req, res, next) => {
  // 1. Get token from cookies or Authorization header
  const tokenFromCookie = req.cookies?.token;
  console.log("token cokkie", tokenFromCookie);
  
  const tokenFromHeader = req.headers?.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  console.log("token :", token);
  

  // 2. Token not found
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if role is strictly 'user'
    if (!decoded || decoded.role !== "user") {
      return res.status(403).json({ message: "Forbidden: Users only" });
    }

    // 5. Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    // 6. Handle token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
