const { v4: uuidv4 } = require("uuid");
const chat_session_model = require("../models/chat_session_model");

const createNewChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const sessionId = uuidv4();
    const session = await chat_session_model.create({ userId, sessionId });
    console.log(`New chat session created for user- ${userId}`);
    return res
      .status(200)
      .json({
        message: `New chat session created for user- ${userId}`,
        session,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "New chat session could not be created!" });
  }
};

const updateChatSessionName = async (req, res) => {
  try {
      const { sessionId, userId, chatTitle } = req.body;

      // Validate input
      if (!sessionId || !userId || !chatTitle) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Find and update the chat session
      const updatedSession = await chat_session_model.findOneAndUpdate(
          { sessionId, userId },
          { chatTitle },
          { new: true } 
      );

      // Check if the session exists
      if (!updatedSession) {
          return res.status(404).json({ message: "Chat session not found" });
      }

      res.status(200).json({
          message: "Chat session title updated successfully",
          session: updatedSession,
      });
  } catch (error) {
      console.error("Error updating chat session name:", error);
      res.status(400).json({ message: "Some error occured" });
  }
};

const getAllChatSessions = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sessions = await chat_session_model.find({userId});
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    res.status(400).json({ message: "Chats could not be found!" });
  }
};

const deleteChatSession = async(req, res) => {
  try {
    const { sessionId } = req.params;
    const deletedSession = await chat_session_model.findOneAndDelete(sessionId);
    
    if(!deletedSession){
      return res.status(404).json({message: "Chat session do not exists"});
    }
    res.status(200).json({ message: "Chat session deleted successfully" });
  } catch (err) {
    console.log("Chat session could not be deleted-", err);
    return res.status(400).json({message: "Chat session could not be deleted!"})
  }
}

module.exports = { createNewChat, getAllChatSessions, updateChatSessionName, deleteChatSession };
