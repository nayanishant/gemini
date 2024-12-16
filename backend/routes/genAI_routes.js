var express = require("express");
const { generateText } = require("../controllers/genAI_controller");

const router = express.Router();

router.post("/app", async (req, res) => {
  try {
    const response = await generateText(req, res);
    res.json(response);
    console.log(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
