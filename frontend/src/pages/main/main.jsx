import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navbar/navbar";
import "./main.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { Remarkable } from "remarkable";

const md = new Remarkable();

const Main = () => {
  const [state, setState] = useState({
    prompt: "",
    response: "",
    loading: false,
    history: [],
  });
  const [sessionId, setSessionId] = useState("");
  const chatContainerRef = useRef(null);

  const name = useSelector((state) => state.user.user.name);

  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  const URL = process.env.REACT_APP_NODE_URL;

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //history funciton
  const fetchHistory = async (currentSessionId) => {
    try {
      const res = await axios.get(`${URL}/history/${currentSessionId}`, config);
      setState((prevState) => ({
        ...prevState,
        history: res.data.history.map((entry) => ({
          role: entry.role,
          text: entry.parts?.[0]?.text || entry.message,
          createdAt: entry.createdAt,
        })),
      }));
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  // generate text function
  const handleResponses = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const { prompt } = state;

    try {
      const res = await axios.post(`${URL}/app`, { prompt, sessionId }, config);

      const userMessage = { role: "user", text: prompt };
      const aiResponse = { role: "model", text: res.data.response };

      setState((prevState) => ({
        ...prevState,
        loading: false,
        history: [...prevState.history, userMessage, aiResponse],
        prompt: "",
      }));
    } catch (error) {
      console.error("Error generating text:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchHistory(storedSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Scroll to the bottom when history updates
  useEffect(() => {
    scrollToBottom();
  }, [state.history]);

  return (
    <>
      <div className="main-wrapper">
        <NavBar />
        <div className="wrapper-right">
          <div className="response-container" ref={chatContainerRef}>
            <div className="chat-container">
              {state.history.length > 0 && (
                <>
                  {state.history.map((el, index) => (
                    <div
                      className={el.role === "user" ? "user" : "model"}
                      key={index}
                    >
                      <div className={el.role === "user" ? "name-logo" : ""}>
                        <div className="text-clr">
                          {el.role === "user" ? (
                            initials
                          ) : (
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                          )}
                        </div>
                      </div>
                      <div>
                        <p
                          className="user-req text-clr"
                          dangerouslySetInnerHTML={{
                            __html: md.render(el.text || ""),
                          }}
                        ></p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {state.loading && (
              <p className="chat-loader">Generating Response...</p>
            )}
          </div>
          <div className="input-container">
            <textarea
              name="search"
              value={state.prompt}
              onChange={(e) => setState({ ...state, prompt: e.target.value })}
              placeholder="Type your message here..."
            ></textarea>
            <div className="send-btn">
              <button
                onClick={handleResponses}
                disabled={state.loading || !state.prompt.trim()}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
