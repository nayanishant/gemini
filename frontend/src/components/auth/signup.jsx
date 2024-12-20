import { useState } from "react";
import "./auth.css";
import axios from "axios";
import Loading from "../loading/loading";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [conflictError, setConflictError] = useState("");
  const [loading, setLoading] = useState(false);
  const URL = "http://localhost:8070";

  const handleSignup = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setConflictError("");
    setLoading(true); 
    try {
      const userData = { email, password };
      const res = await axios.post(`${URL}/register`, userData);

      if (res.status === 201) {
        setSuccessMessage("Registration successful!");
      } else {
        console.log("Unexpected status:", res.status);
        setConflictError("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Cannot create new user:", error);

      if (error.response && error.response.status === 409) {
        setConflictError(error.response.data.error || "User already exists. Please signin.");
      } else {
        setConflictError("Failed to signup. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-left">
      <h2 className="text-clr">Sign Up</h2>
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
      <form method="POST">
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
        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {conflictError && <p className="conflict-message">{conflictError}</p>}
      </form>
      {loading && <Loading />}
    </div>
  );
};

export default Signup;
