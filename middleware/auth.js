import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    console.log("No token found in session");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "vanditinfiniteai");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const checkPermission = (permission) => (req, res, next) => {
  const user = req.user;
  if (user.permissions && user.permissions[permission]) {
    next();
  } else {
    res.status(405).json({
      message: ` You do not have permission to perform ${permission} action.`,
    });
  }
};
