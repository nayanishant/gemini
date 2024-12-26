const express = require("express");
const { generateText } = require("../controllers/genAI_controller");

const router = express.Router();

// Route to handle text generation
router.post("/app", async (req, res) => {
  try {
    // Pass the request and response directly to the controller
    await generateText(req, res);
  } catch (error) {
    // Handle unexpected errors not caught by the controller
    console.error("Unexpected error in /app route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;