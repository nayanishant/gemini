const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      sessionId: {
        type: String,
        required: true,
        index: true,
      },
      chatTitle:{
        type: String,
        index: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        index: true,
      },
})

module.exports = mongoose.model("chatSession", chatSessionSchema);