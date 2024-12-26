const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,       // Unique identifier for a session
  },
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,       // Specifies if it's a user or AI's response
  },
  parts: [
    {
      text: {
        type: String,
        required: true,    // The actual text of the message
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,     // Timestamp of when the message was recorded
  },
});

module.exports = mongoose.model("History", HistorySchema);
