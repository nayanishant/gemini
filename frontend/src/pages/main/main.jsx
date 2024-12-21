import NavBar from "../../components/navbar/navbar";
import "./main.css";
import { useSelector } from "react-redux";

const Main = () => {
  const name = useSelector((state) => state.user.user.name);

  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  return (
    <>
      <div className="main-wrapper">
        <NavBar />
        <div className="wrapper-right">
          <div className="response-container">
            <div>
              <div className="user">
                <div className="name-logo">
                  <p className="text-clr">{initials}</p>
                </div>
                <p className="text-clr">Hi, How are you?</p>
              </div>
              <div className="model">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <p className="text-clr">
                  I am doing well, thank you for asking! How are you today?
                </p>
              </div>
            </div>
          </div>
          <div className="input-container">
            <textarea name="search"></textarea>
            <div className="send-btn">
              <button>
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
