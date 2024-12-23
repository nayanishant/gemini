import { useState, useEffect } from "react";
import NavBar from "../../components/navbar/navbar";
import "./main.css";
import { useSelector } from "react-redux";
import axios from "axios";

const Main = () => {
  const [state, setState] = useState({
    prompt: "",
    response: "",
    loading: false,
    history: [],
  });
  const name = useSelector((state) => state.user.user.name);

  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  const URL = "http://localhost:8070";

  const handleResponses = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const { prompt, history } = state;

    try {
      const res = await axios.post(`${URL}/app`, { prompt, history });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        response: res.data.response,
        history: res.data.history,
      }));
      console.log("History", state.history)
    } catch (error) {
      console.error("Error generating text:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setState((prevState) => ({
        ...prevState,
        history: JSON.parse(storedHistory),
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(state.history));
  }, [state.history]);

  return (
    <>
      <div className="main-wrapper">
        <NavBar />
        <div className="wrapper-right">
          <div className="response-container">
            <div>
              {state.history.length > 0 &&
                state.history.map((el, index) => (
                  <div className="user" key={index}>
                    <div className="name-logo">
                      <p className="text-clr">{initials}</p>
                    </div>
                    {el.parts.map((part, partIndex) => (
                      <p className="user-req text-clr" key={partIndex}>{part.text}</p>
                    ))}
                  </div>
                ))}
              {state.response && (
                <div className="model">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <p className="text-clr">{state.response}</p>
                </div>
              )}
            </div>
          </div>
          <div className="input-container">
            <textarea
              name="search"
              value={state.prompt}
              onChange={(e) => setState({ ...state, prompt: e.target.value })}
            ></textarea>
            <div className="send-btn">
              <button onClick={handleResponses} disabled={state.loading}>
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
