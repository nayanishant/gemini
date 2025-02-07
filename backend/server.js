var express = require("express");
var cors = require('cors');
const dotenv = require("dotenv");
var mongoose = require("mongoose");
var loginRoutes = require("./routes/login_routes");
var genAIRoutes = require("./routes/genAI_routes")
var chatRoutes = require("./routes/chat_routes")

dotenv.config();
const port = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  }));

app.use(loginRoutes);
app.use(genAIRoutes);
app.use("/api/v1", chatRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB Connected!");
    app.listen(port, () => {
      console.log("Server has started on port: ", port);
    });
  } catch (err) {
    console.error("Error starting server: ", err.message);
  }
};

startServer();
