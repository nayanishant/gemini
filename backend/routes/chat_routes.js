const express = require("express");
const verifyUser_middleware = require("../middleware/verifyUser_middleware");
const {
  createNewChat,
  getAllChatSessions,
  updateChatSessionName,
  deleteChatSession,
} = require("../controllers/chat_controller");
const router = express.Router();

router.post(`/create-new-chat`, verifyUser_middleware, createNewChat);
router.post(
  `/update-chat-session-name`,
  verifyUser_middleware,
  updateChatSessionName
);
router.post(`/find-all-chats`, verifyUser_middleware, getAllChatSessions);
router.delete(`/delete-chat-session/:sessionId`, verifyUser_middleware, deleteChatSession);

module.exports = router;
