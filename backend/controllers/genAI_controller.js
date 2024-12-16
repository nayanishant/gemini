const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateText = async (req, res) => {
  const { prompt } = req.body;

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

    // Initialize the generative AI client
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Fetch the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define an empty history array to store conversation history
    let history = [];

    // Check if a history object is provided in the request body
    if (req.body.history && Array.isArray(req.body.history)) {
      history = req.body.history; // Use the provided history
    }

    // Start a new chat session with the initial history
    const chat = model.startChat({ history });

    // Send the user's prompt and process the response stream
    const response = await chat.sendMessageStream(prompt);
    let responseText = "";

    for await (const chunk of response.stream) {
      responseText += chunk.text();
    }

    // Update the history with the latest interaction
    history.push({ role: "user", parts: [{ text: prompt }] });
    history.push({ role: "model", parts: [{ text: responseText }] });

    // Return the AI-generated text and the updated history
    res.json({ response: responseText, history });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error occurred in generateText:", error);

    // Handle specific error types for better client feedback
    if (error.response && error.response.status) {
      return res.status(error.response.status).json({ error: error.message });
    }

    // Handle general or unexpected errors
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generateText };