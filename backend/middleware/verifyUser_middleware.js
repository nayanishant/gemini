var jwt = require("jsonwebtoken");
const userModel = require("../models/login_model");

const verifyUser_middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid");
      return res
        .status(401)
        .json({ error: "Authorization header missing or invalid" });
    }

    const token = authHeader.replace("Bearer ", "");

    

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = payload;
    const user = await userModel.findById(_id);
    if (!user) {
      console.error("User not found for ID:", _id);
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired at:", error.expiredAt);
      console.error("Token expired at:", error);
      return res.status(401).json({ error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.error("Invalid token:", error.message);
      return res.status(401).json({ error: "Token invalid" });
    } else {
      console.error("Error in verifyUser middleware:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = verifyUser_middleware;
