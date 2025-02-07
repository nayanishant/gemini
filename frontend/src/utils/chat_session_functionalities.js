import axios from "axios";
import config from "./config";

//Function to delete a chat session if it contais no chats
const deleteChatSession = async (sessionId) => {
  try {
    const resp = await axios.delete(
      `${process.env.REACT_APP_NODE_URL}/api/v1/delete-chat-session/${sessionId}`,
      config
    );
  } catch (err) {
    console.log(err);
  }
};

export { deleteChatSession };