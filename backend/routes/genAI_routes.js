const express = require("express");
const { generateText, historyHandler } = require("../controllers/genAI_controller");
const verifyUser_middleware = require("../middleware/verifyUser_middleware");

const router = express.Router();

router.post("/app", verifyUser_middleware, generateText);
router.get("/history/:sessionId", verifyUser_middleware, historyHandler)

module.exports = router;