import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navbar/navbar";
import "./main.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../utils/config";

//Markdown
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


const Main = () => {
  const [state, setState] = useState({
    prompt: "",
    response: "",
    loading: false,
    history: [],
  });
  const [sessionId, setSessionId] = useState("");
  const chatContainerRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  const URL = process.env.REACT_APP_NODE_URL;

  //Function to fetch all prompts and responses history by sessionId
  const fetchHistory = async (sessionId) => {
    try {
      const res = await axios.get(`${URL}/history/${sessionId}`, config);

      const chatHistory = res.data.history.map((entry) => ({
        role: entry.role,
        text: entry.parts?.[0]?.text || entry.message,
        createdAt: entry.createdAt,
      }));

      setState((prevState) => ({
        ...prevState,
        history: chatHistory,
      }));

    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // generate text function
  // const handleResponses = async () => {
  //   setState((prevState) => ({ ...prevState, loading: true }));
  //   const { prompt } = state;

  //   try {
  //     const res = await axios.post(`${URL}/app`, { prompt, sessionId }, config);

  //     const userMessage = { role: "user", text: prompt };
  //     const aiResponse = { role: "model", text: res.data.response };

  //     setState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //       history: [...prevState.history, userMessage, aiResponse],
  //       prompt: "",
  //     }));
  //   } catch (error) {
  //     console.error("Error generating text:", error);
  //     setState((prevState) => ({ ...prevState, loading: false }));
  //   }
  // };

  const handleResponses = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const { prompt } = state;

    try {
      let currentSessionId = localStorage.getItem("sessionId");

      if (!currentSessionId) {
        currentSessionId = await createNewSession();
        if (!currentSessionId) {
          setState((prevState) => ({ ...prevState, loading: false }));
          return;
        }
        navigate(`/chat/${currentSessionId}`);
        return;
      }

      // If session exists, proceed with generating the response
      const res = await axios.post(
        `${URL}/app`,
        { prompt, sessionId: currentSessionId },
        config
      );

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

  const createNewSession = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_URL}/api/v1/create-new-chat`,
        { userId: user._id },
        config
      );

      const newSessionId = response.data.session.sessionId;
      localStorage.setItem("sessionId", newSessionId);
      console.log("Created new session ID:", newSessionId);
      setSessionId(newSessionId);

      return newSessionId;
    } catch (err) {
      console.log("New chat could not be generated!", err);
      return null;
    }
  };

  const storedSessionId = localStorage.getItem("sessionId");
  useEffect(() => {
    if (storedSessionId) {
      fetchHistory(storedSessionId);
    } else {
      console.log("session id not found!");
    }
  }, [storedSessionId]);

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
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            strong: ({ ...props }) => (
                              <strong className="markdown-strong" {...props} />
                            ),
                            em: ({ ...props }) => (
                              <em className="markdown-em" {...props} />
                            ),
                            p: ({ ...props }) => (
                              <p
                                className={`markdown-p ${
                                  el.role === "user"
                                    ? "markdown-user"
                                    : " "
                                }`}
                                {...props}
                              />
                            ),
                            ul: ({ ...props }) => (
                              <ul className="markdown-ul" {...props} />
                            ),
                            ol: ({ ...props }) => (
                              <ol className="markdown-ol" {...props} />
                            ),
                            li: ({ ...props }) => (
                              <li className="markdown-li" {...props} />
                            ),
                            blockquote: ({ ...props }) => (
                              <blockquote
                                className="markdown-blockquote"
                                {...props}
                              />
                            ),
                            code: ({ ...props }) => (
                              <code
                                className={`markdown-code ${
                                  el.role === "user"
                                    ? ""
                                    : "markdown-other-code"
                                }`}
                                {...props}
                              />
                            ),
                            pre: ({ ...props }) => (
                              <pre className="markdown-pre" {...props} />
                            ),
                            h1: ({ ...props }) => (
                              <h1 className="markdown-h1" {...props} />
                            ),
                            h2: ({ ...props }) => (
                              <h2 className="markdown-h2" {...props} />
                            ),
                            h3: ({ ...props }) => (
                              <h3 className="markdown-h3" {...props} />
                            ),
                            h4: ({ ...props }) => (
                              <h4 className="markdown-h4" {...props} />
                            ),
                            a: ({ ...props }) => (
                              <a className="markdown-a" {...props} />
                            ),
                          }}
                        >
                          {el.text}
                        </Markdown>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleResponses();
                }
              }}
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
