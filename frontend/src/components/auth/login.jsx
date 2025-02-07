import { useState } from "react";
import "./auth.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import Loading from "../loading/loading";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const URL = process.env.REACT_APP_NODE_URL;
  // console.log(URL);

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const userData = { email, password };
    try {
      const res = await axios.post(`${URL}/login`, userData);
      const loggedInUser = res.data.user;
      console.log(res.data.user);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        dispatch(login(loggedInUser));
        navigate("/chat");
        setSuccessMessage("Login successful!");
      } else {
        setError(res.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error logging user:", error);

      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || "Invalid email or password.");
      } else if (error.response && error.response.status === 500) {
        setError(error.response.data.error || "Internal server error.");
      } else {
        setError("Failed to signin. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-left">
      <h2 className="text-clr">Sign In</h2>
      <div className="social-btn">
        <button>
          <i className="fab fa-google"></i>
        </button>
        <button>
          <i className="fab fa-facebook"></i>
        </button>
        <button>
          <i className="fab fa-linkedin"></i>
        </button>
      </div>
      <p className="text-clr">or use your email account:</p>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <a href="www.google.com" className="text-clr">
          Forgot Your Password?
        </a>
        <button onClick={handleSignin}>Sign In</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="conflict-message">{error}</p>}
      </form>
      {loading && <Loading />}
    </div>
  );
};

export default Login;
