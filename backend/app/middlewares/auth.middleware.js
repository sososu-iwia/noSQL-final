import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = { id: decoded.id, role: decoded.role }; // ✅
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authMiddleware;
