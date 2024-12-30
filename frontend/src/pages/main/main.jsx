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

  const URL = "http://localhost:8070";

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleResponses = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const { prompt } = state;

    try {
      const res = await axios.post(`${URL}/app`, { prompt, sessionId }, config);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        response: res.data.response,
        history: [
          ...prevState.history,
          { role: "user", text: prompt },
          { role: "model", text: res.data.response },
        ],
        prompt: "",
      }));
    } catch (error) {
      console.error("Error generating text:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${URL}/history/${storedSessionId || sessionId}`,
          config
        );
        setState((prevState) => ({
          ...prevState,
          history: res.data.history.map((entry) => ({
            role: entry.role,
            text: entry.message,
            createdAt: entry.createdAt,
          })),
        }));
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
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
