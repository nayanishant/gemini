var jwt = require("jsonwebtoken");
const userModel = require("../models/login_model");

const verifyUser_middleware = async (req, res, next) => {
  try {
    console.log("Request headers: ", req.headers);

    // Check if authorization header is present and properly formatted
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or incorrectly formatted");
      return res
        .status(401)
        .json({ error: "Authorization header missing or invalid" });
    }

    // Extract the token for the Authorization header
    const token = authHeader.replace("Bearer ", "");
    console.log("Extracted token: ", token);

    // Verify the token and extract the payload
    const payolad = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Token payolad: ", payolad);

    // Extract the userID from the payload
    const { _id } = payolad;

    // Find the user in the database
    const user = await userModel.findById(_id);
    if (!user) {
      console.log("User not found for ID: ", _id);
      return res.status(404).json({ error: "User not found." });
    }

    console.log("Authenticated user: ", user);

    // Attach the user to the request object for downstream use
    req.user = user;

    // Process the next middleware or route handle
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token expired at:", error.expiredAt);
      return res.status(401).json({ error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token:", error.message);
      return res.status(401).json({ error: "Token invalid" });
    } else {
      console.error("Error in verifyUser middleware:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = verifyUser_middleware;