const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Authorization token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = decoded;
    if (!userId) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticate };
