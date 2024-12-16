var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const userModel = require("../models/login_model");

const userRegisterHandler = async (req, res) => {
  // Extract `email` and `password` from the request body using destructuring
  const { email, password } = req.body;

  try {
    // validating input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required.",
      });
    }

    // Finding user from database through email
    const user = await userModel.findOne({
      email,
    });

    // Checking if user already exists in the database or not
    if (user) {
      return res.status(409).json({
        error: "User already exists.",
      });
    }

    // Hashing user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
    });
    const response = await newUser.save();

    return res.status(201).json({
      message: "User successfully created!",
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const userLoginHandler = async (req, res) => {
  // Extract email and password
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with user ID and email
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send successful response with limited user data and token
    const sanitizedUser = { _id: user._id, email: user.email };

    return res.status(200).json({
      message: "Login successful",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    console.error("Error logging user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  userRegisterHandler,
  userLoginHandler,
};
