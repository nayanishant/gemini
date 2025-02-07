const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const History = require("../models/history_model");
const chat_messages_model = require("../models/chat_messages_model");

const generateText = async (req, res) => {
  const { prompt, sessionId } = req.body;

  try {
    if (!process.env.API_KEY) {
      console.error("Missing API key in environment variables");
      return res
        .status(500)
        .json({ error: "Server configuration error: Missing API key" });
    }

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid or missing prompt in request body");
      return res.status(400).json({ error: "Invalid or missing prompt" });
    }

    if (!sessionId || typeof sessionId !== "string") {
      console.error("Invalid or missing sessionId in request body");
      return res.status(400).json({ error: "Invalid or missing sessionId" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const history = await History.find({ sessionId }).sort({ createdAt: 1 });

    const formattedHistory = history.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.message }],
    }));

    if (
      !formattedHistory.every(
        (entry) =>
          entry.parts && Array.isArray(entry.parts) && entry.parts[0]?.text
      )
    ) {
      console.error("Invalid history format");
      return res
        .status(500)
        .json({ error: "Server error: Invalid history format" });
    }

    const chat = model.startChat({ history: formattedHistory });

    const response = await chat.sendMessageStream(prompt);
    let responseText = "";

    try {
      for await (const chunk of response.stream) {
        responseText += chunk.text();
      }
    } catch (streamError) {
      console.error("Error during response streaming:", streamError);
      return res.status(500).json({ error: "Error streaming response" });
    }

    // await History.create({
    //   userId: req.user.id,
    //   sessionId,
    //   role: "user",
    //   message: prompt,
    // });

    // await History.create({
    //   userId: req.user.id,
    //   sessionId,
    //   role: "model",
    //   message: responseText,
    // });

    await chat_messages_model.create({
      userId: req.user.id,
      sessionId,
      role: "user",
      message: prompt,
    });

    await chat_messages_model.create({
      userId: req.user.id,
      sessionId,
      role: "model",
      message: responseText,
    });

    res.json({ response: responseText, sessionId });
  } catch (error) {
    console.error("Error occurred in generateText:", error);

    if (error.response && error.response.status) {
      return res.status(error.response.status).json({ error: error.message });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// const historyHandler = async (req, res) => {
//   const { userId } = req.params;
//   const { limit } = req.query;

//   try {
//     if (!userId || typeof userId !== "string") {
//       return res.status(400).json({ error: "Invalid or missing userId" });
//     }

//     const query = History.find({ userId }).sort({ createdAt: 1 });

//     if (limit) {
//       const parsedLimit = parseInt(limit, 10);
//       if (isNaN(parsedLimit) || parsedLimit <= 0) {
//         return res.status(400).json({ error: "Invalid limit value" });
//       }
//       query.limit(parsedLimit);
//     }

//     const history = await query;

//     const formattedHistory = history.map((entry) => ({
//       role: entry.role,
//       parts: [{ text: entry.message }],
//       createdAt: entry.createdAt,
//     }));

//     res.json({ userId, history: formattedHistory });
//   } catch (error) {
//     console.error("Error fetching history:", error);
//     res.status(500).json({ error: "An unexpected error occurred." });
//   }
// };

const historyHandler = async (req, res) => {
  const { sessionId } = req.params;
  const { limit } = req.query;

  try {
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Invalid or missing sessionId" });
    }

    const query = chat_messages_model.find({ sessionId }).sort({ createdAt: 1 });

    // if (limit) {
    //   const parsedLimit = parseInt(limit, 10);
    //   if (isNaN(parsedLimit) || parsedLimit <= 0) {
    //     return res.status(400).json({ error: "Invalid limit value" });
    //   }
    //   query.limit(parsedLimit);
    // }

    const history = await query;

    const formattedHistory = history.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.message }],
      createdAt: entry.createdAt,
    }));

    return res.status(200).json({ sessionId, history: formattedHistory });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(400).json({ error: "An unexpected error occurred." });
  }
};

module.exports = {
  generateText,
  historyHandler,
};
