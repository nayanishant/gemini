const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const History = require("../models/history_model"); // Assuming the History model is in the models folder

const generateText = async (req, res) => {
  const { prompt, sessionId } = req.body;

  try {
    // Validate API key
    if (!process.env.API_KEY) {
      console.error("Missing API key in environment variables");
      return res
        .status(500)
        .json({ error: "Server configuration error: Missing API key" });
    }

    // Validate prompt
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid or missing prompt in request body");
      return res.status(400).json({ error: "Invalid or missing prompt" });
    }

    // Validate sessionId
    if (!sessionId || typeof sessionId !== "string") {
      console.error("Invalid or missing sessionId in request body");
      return res.status(400).json({ error: "Invalid or missing sessionId" });
    }

    // Initialize the generative AI client
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Fetch the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Retrieve existing history for the session
    let history = await History.find({ sessionId }).sort({ createdAt: 1 });

    // Format history for the AI model
    const formattedHistory = history.map((entry) => ({
      role: entry.role,
      parts: entry.parts.map((part) => ({ text: part.text }))
    }));

    // Start a new chat session with the initial history
    const chat = model.startChat({ history: formattedHistory });

    // Send the user's prompt and process the response stream
    const response = await chat.sendMessageStream(prompt);
    let responseText = "";

    for await (const chunk of response.stream) {
      responseText += chunk.text();
    }

    // Save the user's message to the database
    await History.create({
      sessionId,
      role: "user",
      parts: [{ text: prompt }],
    });

    // Save the AI's response to the database
    await History.create({
      sessionId,
      role: "model",
      parts: [{ text: responseText }],
    });

    // Return the AI-generated text and the updated history
    res.json({ response: responseText, sessionId });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error occurred in generateText:", error);

    // Handle specific error types for better client feedback
    if (error.response && error.response.status) {
      return res.status(error.response.status).json({ error: error.message });
    }
  }
};

module.exports = { generateText };
